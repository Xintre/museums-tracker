import { DeleteMuseumRequestDTO } from '@xintre/shared';
import { GenericValidator } from './GenericValidator';
import { z } from 'zod';

const deleteMuseumReqSchema = z
	.object({
		id: z
			.number({
				required_error: 'id is required',
				invalid_type_error: 'id must be of integer type',
			})
			.int(),
	})
	.strict();

export class DeleteMuseumRequestDTOValidator extends GenericValidator<DeleteMuseumRequestDTO> {
	constructor() {
		super(deleteMuseumReqSchema);
	}
}

export const deleteMuseumRequestDTOValidator =
	new DeleteMuseumRequestDTOValidator();
