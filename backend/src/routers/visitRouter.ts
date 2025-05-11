import {
	AddVisitRequestDTO,
	AddVisitResponseDTO,
	GetVisitsRequestDTO,
	GetVisitsResponseDTO,
} from '@xintre/shared';
import { Museum, Visit } from '@/database/entity';
import {
	ValidationError,
	addVisitRequestValidator,
	getVisitsRequestValidator,
} from '@/validators';

import { AppDataSource } from '@/database/data-source';
import express from 'express';
import signale from 'signale';

export const visitRouter = express.Router();

visitRouter.post<
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	{},
	AddVisitResponseDTO | ValidationError,
	AddVisitRequestDTO
>('/', async (req, res) => {
	const maybeValidationError = addVisitRequestValidator.validate(req.body);
	if (maybeValidationError) {
		res.status(400).send(maybeValidationError);
		signale.error(
			'Invalid request to add visit endpoint',
			maybeValidationError,
		);
		return;
	} else {
		const { museumId, dateOfVisit, rate } = req.body;
		try {
			const museum = await Museum.findOneByOrFail({
				id: museumId,
			});

			const visit = new Visit();
			visit.museum = museum;
			visit.dateOfVisit = dateOfVisit;
			visit.rate = rate;

			await visit.save();

			res.sendStatus(200);
			return;
		} catch (error) {
			signale.error('Museum not found', { museumId, error });
			res.status(404);
			return;
		}
	}
});

visitRouter.get<
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	{},
	GetVisitsResponseDTO | ValidationError,
	GetVisitsRequestDTO
>('/', async (req, res) => {
	const museumId = Number(req.query.museumId);

	const maybeValidationError = getVisitsRequestValidator.validate({
		museumId: museumId,
	});

	if (maybeValidationError) {
		res.status(400).send(maybeValidationError);
		signale.error(
			'Invalid request to get visits endpoint',
			maybeValidationError,
		);
		return;
	}
	try {
		await Museum.findOneByOrFail({ id: museumId });

		const visits = await Visit.find({
			where: {
				museum: {
					id: museumId,
				},
			},
			relations: {
				museum: true,
			},
			select: {
				dateOfVisit: true,
				rate: true,
				museum: {
					id: true,
				},
			},
		});

		const numberOfVisits = await Visit.count({
			where: {
				museum: {
					id: museumId,
				},
			},
		});

		const avgRate = await AppDataSource.getRepository(Visit)
			.createQueryBuilder('visit')
			.select('AVG(visit.rate)', 'avg')
			.where('visit.museumId = :id', { id: museumId })
			.getRawOne();

		if (visits.length === 0) {
			res.sendStatus(404);
			signale.error('No visits of the museum', museumId);
			return;
		} else if (visits.length > 0) {
			res.send({
				visits: visits,
				numberOfVisits,
				avgRate,
			});
		}
	} catch {
		res.sendStatus(404);
		signale.error('Museum not found', museumId);
	}
});
