import { EditMuseumRequestDTO } from '@xintre/shared';
import { GenericValidator } from '../GenericValidator';
import { z } from 'zod';

const editMuseumReqSchema = z
	.object({
		id: z
			.number({
				invalid_type_error: 'id must be an integer',
				required_error: 'id is required',
			})
			.int()
			.positive(),
		name: z
			.string({
				required_error: 'name is required',
				invalid_type_error: 'name must be an integer',
			})
			.nonempty(),
	})
	.strict();

export class EditMuseumRequestValidator extends GenericValidator<EditMuseumRequestDTO> {
	constructor() {
		super(editMuseumReqSchema);
	}
}

export const editMuseumRequestValidator = new EditMuseumRequestValidator();
