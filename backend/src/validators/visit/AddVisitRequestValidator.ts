import { AddVisitRequestDTO } from '@xintre/shared';
import { GenericValidator } from '../GenericValidator';
import { z } from 'zod';

const addVisitReqSchema = z.object({
	rate: z.number().int().min(1).max(5),
	dateOfVisit: z.preprocess(
		(val) => (typeof val === 'string' ? new Date(val) : val),
		z.date(),
	),
	museumId: z
		.number({
			invalid_type_error: 'museumId must be an integer',
			required_error: 'museumId is required',
		})
		.int(),
});

export class AddVisitRequestValidator extends GenericValidator<AddVisitRequestDTO> {
	constructor() {
		super(addVisitReqSchema);
	}
}

export const addVisitRequestValidator = new AddVisitRequestValidator();
