import { AddVisitRequestDTO, AddVisitResponseDTO } from '@xintre/shared';
import { Museum, Visit } from '@/database/entity';
import { ValidationError, addVisitRequestValidator } from '@/validators';

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
		res.status(400).send(maybeValidationError).end();
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
			res.status(404).json({ message: 'Museum not found', museumId });
			return;
		}
	}
});
