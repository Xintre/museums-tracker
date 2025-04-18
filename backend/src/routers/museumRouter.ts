import type {
	AddMuseumRequestDTO,
	AddMuseumResponseDTO,
	DeleteMuseumRequestDTO,
	DeleteMuseumResponseDTO,
	EditMuseumRequestDTO,
	EditMuseumResponseDTO,
	GetMuseumsResponseDTO,
	MuseumDTO,
	SearchForAddressResponseDTO,
} from '@xintre/shared';

import { Museum } from '@/database/entity/Museum';
import { NominatimService } from '@/services/NominatimService';
import { QueryFailedError } from 'typeorm';
import { ValidationError } from '@/validators/types';
import { addMuseumRequestDTOValidator } from '@/validators/AddMuseumRequestDTOValidator';
import { deleteMuseumRequestDTOValidator } from '@/validators/DeleteMuseumRequestDTOValidator';
import { editMuseumRequestValidator } from '@/validators/EditMuseumRequestDTOValidator';
import { ensurePaginationParamsInBounds } from '@/utils/pagination';
import express from 'express';
import { getMuseumsRequestDTOValidator } from '@/validators/GetMuseumsRequestDTOValidator';
import { instanceToPlain } from 'class-transformer';
import { searchForAddressRequestDTOValidator } from '@/validators/SearchForAddressRequestDTOValidator';
import signale from 'signale';

export const museumRouter = express.Router();

museumRouter.post<
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	{},
	AddMuseumResponseDTO | ValidationError,
	AddMuseumRequestDTO
>('/', async (req, res) => {
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
		const nominatimData = await NominatimService.lookupPlace({
			osmid,
			osmType,
		});

		if (!nominatimData) {
			res.status(404).end();
			return;
		}

		try {
			const museum = new Museum();
			museum.name = name;
			museum.osmid = osmid;
			museum.address = nominatimData.address;
			museum.latitude = nominatimData.lat;
			museum.longitude = nominatimData.lon;

			await museum.save();

			res.send({
				id: museum.id,
				name: museum.name,
				address: museum.address,
			});
		} catch (error) {
			if (
				error instanceof QueryFailedError &&
				'code' in error.driverError &&
				error.driverError.code === '23505' // PostgreSQL: unique_violation
			) {
				signale.error(
					'Museum already exists, updating instead...',
					error,
				);

				res.status(409).end();
			}
		}
	} catch (error) {
		signale.error('Error fetching from Nominatim', error);
		res.status(500).end();
	}
});

museumRouter.get<
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	{},
	GetMuseumsResponseDTO | ValidationError
>('/', async (req, res) => {
	// validate request
	const pageSize = Number(req.query.pageSize);
	const page = Number(req.query.page);

	const maybeValidationError = getMuseumsRequestDTOValidator.validate({
		pageSize,
		page,
	});

	if (maybeValidationError) {
		res.status(400).send(maybeValidationError);
		signale.error('Invalid get museums request', maybeValidationError);
		return;
	}

	const museumsCount = await Museum.count({});
	const museums = await Museum.find({
		take: pageSize,
		skip: page * pageSize,
		order: {
			name: 'asc',
		},
	});

	// sanitize pagination state
	const paginationInfo = ensurePaginationParamsInBounds({
		pageSize,
		page,
		totalCount: museumsCount,
	});

	res.send({
		museums: museums.map((museum) => instanceToPlain(museum) as MuseumDTO),
		...paginationInfo,
	});
});

museumRouter.patch<
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	{},
	EditMuseumResponseDTO | ValidationError,
	EditMuseumRequestDTO
>('/', async (req, res) => {
	// validate request
	const maybeValidationError = editMuseumRequestValidator.validate(req.body);

	if (maybeValidationError) {
		res.status(400).send(maybeValidationError);
		signale.error(
			'Invalid request to add museum endpoint',
			maybeValidationError,
		);
		return;
	}

	const { id, name } = req.body;
	try {
		const existingMuseum = await Museum.findOneBy({
			id: id,
		});

		if (existingMuseum) {
			existingMuseum.name = name;

			await existingMuseum.save();

			res.status(200).send({
				id: existingMuseum.id,
				name: existingMuseum.name,
			});
		} else {
			signale.error('Museum not found!');
			res.status(404).end();
		}
	} catch (error: unknown) {
		signale.error('Could not fetch data from Nominatim!', error);
		res.status(500).end();
	}
});

museumRouter.get<
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	{},
	SearchForAddressResponseDTO | ValidationError
>('/search', async (req, res) => {
	// validate request
	const query = String(req.query.query);

	const maybeValidationError = searchForAddressRequestDTOValidator.validate({
		query,
	});

	if (maybeValidationError) {
		res.status(400).send(maybeValidationError);
		signale.error('Invalid search museum request', maybeValidationError);
		return;
	}

	const nominatimData = await NominatimService.searchForPlace(query);

	if (!nominatimData) {
		res.status(404).send();
		return;
	}

	res.send(nominatimData);
});

museumRouter.delete<
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	{},
	DeleteMuseumResponseDTO | ValidationError,
	DeleteMuseumRequestDTO
>('/', async (req, res) => {
	// validate request
	const maybeValidationError = deleteMuseumRequestDTOValidator.validate(
		req.body,
	);

	if (maybeValidationError) {
		res.status(400).send(maybeValidationError);
		signale.error('Invalid delete museum request', maybeValidationError);
		return;
	}

	try {
		await Museum.delete(req.body.id);

		signale.info(`Museum ${req.body.id}`);

		res.status(200).send({}).end();
	} catch {
		res.status(404).end();
	}
});

museumRouter.patch<
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	{},
	EditMuseumResponseDTO | ValidationError,
	EditMuseumRequestDTO
>('/', async (req, res) => {
	// validate request
	const maybeValidationError = editMuseumRequestValidator.validate(req.body);

	if (maybeValidationError) {
		res.status(400).send(maybeValidationError);
		signale.error(
			'Invalid request to patch museum endpoint',
			maybeValidationError,
		);
		return;
	}

	const { id, name } = req.body;

	try {
		const existingMuseum = await Museum.findOneBy({
			id: id,
		});
		if (existingMuseum) {
			existingMuseum.name = name;

			await existingMuseum.save();

			res.status(200).send({
				id: existingMuseum.id,
				name: existingMuseum.name,
			});
		} else {
			signale.error('Museum not found!');
			res.status(404).end();
		}
	} catch {
		res.status(404).end();
	}
});
