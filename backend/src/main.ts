import 'dotenv/config';
import 'reflect-metadata';

import {
	AddMuseumRequestDTO,
	AddMuseumResponseDTO,
	GetMuseumsRequestDTO,
	GetMuseumsResponseDTO,
} from '@xintre/shared';
import { NominatimError, ValidationError } from './validators/types';
import express, { Request, Response } from 'express';

import { AppDataSource } from '@/database/data-source';
import { GetMuseumsRequestDTOValidator } from './validators/GetMuseumsRequestDTOValidator';
import { Museum } from './database/entity/Museum';
import { NominatimResponseDTO } from '@xintre/shared/src/dto/NominatimResponseDTO';
import { QueryFailedError } from 'typeorm';
import { addMuseumRequestDTOValidator } from './validators/AddMuseumRequestDTOValidator';
import axios from 'axios';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import process from 'process';
import signale from 'signale';

async function main() {
	await AppDataSource.initialize();

	const app = express();
	app.use(helmet());
	app.use(cors());
	app.use(express.json());

	app.use(morgan('combined'));

	const PORT = process.env.PORT ?? 8000;

	app.listen(PORT, () => {
		signale.success(`Server running on port ${PORT}`);
	});

	app.post<
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		{},
		AddMuseumResponseDTO | ValidationError | NominatimError,
		AddMuseumRequestDTO
	>('/api/museums-tracker/add', async (req, res) => {
		// validate request
		const maybeValidationError = addMuseumRequestDTOValidator.validate(
			req.body,
		);

		if (maybeValidationError) {
			res.status(400).send(maybeValidationError);
			signale.error(
				'Invalid request to add museum endpoint',
				maybeValidationError,
			);
			return;
		}

		const { name, osmType, osmid } = req.body;

		try {
			const response = await axios.get<NominatimResponseDTO>(
				'https://nominatim.openstreetmap.org/lookup',
				{
					params: {
						osm_ids: `${osmType}${osmid}`,
						format: 'json',
					},
					headers: {
						'User-Agent': process.env.NOMINATIM_USER_AGENT,
					},
				},
			);

			// always take the first match
			const nominatimData = response.data?.[0];

			if (!nominatimData) {
				res.status(404).send({ error: 'Place not found in Nominatim' });
				return;
			}

			try {
				const museum = new Museum();
				museum.name = name;
				museum.osmid = String(osmid);
				museum.address = nominatimData.address;
				museum.latitude = nominatimData.lat;
				museum.longitude = nominatimData.lon;

				await museum.save();

				res.send({
					id: museum.id,
					name: museum.name,
				});
			} catch (error) {
				if (
					error instanceof QueryFailedError &&
					'code' in error.driverError &&
					error.driverError.code === '23505' // PostgreSQL: unique_violation
				) {
					signale.warn(
						'Museum already exists, updating instead...',
						error,
					);

					const existingMuseum = await Museum.findOneBy({
						osmid: String(osmid),
					});
					if (existingMuseum) {
						existingMuseum.name = name;
						existingMuseum.address = nominatimData.address;
						existingMuseum.latitude = nominatimData.lat;
						existingMuseum.longitude = nominatimData.lon;

						await existingMuseum.save();

						res.status(200).send({
							id: existingMuseum.id,
							name: existingMuseum.name,
						});
					} else {
						res.status(500).send({
							error: 'Museum already exists, but could not find it for update',
						});
					}

					return;
				}
			}
		} catch (error) {
			signale.error('Error fetching from Nominatim', error);
			res.status(500).send({
				error: 'Failed to fetch data from Nominatim',
			});
		}
	});

	app.get<GetMuseumsRequestDTO, GetMuseumsResponseDTO | ValidationError>(
		'/api/museums-tracker/get-museums',
		async (req, res) => {
			// validate request
			const pageSize = String(req.query.pageSize);

			const maybeValidationError = GetMuseumsRequestDTOValidator.validate(
				{ pageSize: pageSize },
			);

			if (maybeValidationError) {
				res.status(400).send(maybeValidationError);
				signale.error(
					'Invalid GetMuseums request',
					maybeValidationError,
				);
				return;
			}

			const museums = await Museum.find({});

			res.send({
				museums: museums.map((museum) => ({
					id: museum.id,
					name: museum.name,
					osmid: museum.osmid,
					address: museum.address,
					longitude: museum.longitude,
					latitude: museum.latitude,
					createdAt: museum.createdAt,
				})),
				page: 1,
				totalPages: 1,
			});
		},
	);

	// 404 middleware - must be at the end of the file!
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	app.use((_req, res, _next) => {
		res.status(404).send('404 Not Found - please try something else');
	});

	// 500 ISE middleware - must be at the end of the file!
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	app.use((err: Error, _req: Request, res: Response, _next: unknown) => {
		console.error(err.stack);
		res.status(500).send('500 ISE - something went wrong');
	});
}

main();
