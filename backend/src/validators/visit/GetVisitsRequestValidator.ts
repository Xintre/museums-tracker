import { GenericValidator } from '../GenericValidator';
import { GetVisitsRequestDTO } from '@xintre/shared';
import { z } from 'zod';

export const getVisitsReqSchema = z.object({
	museumId: z.number().int(),
});

export class GetVisitsRequestValidator extends GenericValidator<GetVisitsRequestDTO> {
	constructor() {
		super(getVisitsReqSchema);
	}
}

export const getVisitsRequestValidator = new GetVisitsRequestValidator();
