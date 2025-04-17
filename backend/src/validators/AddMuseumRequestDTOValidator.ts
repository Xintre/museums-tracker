import { AddMuseumRequestDTO } from '@xintre/shared';
import { GenericValidator } from './GenericValidator';
import { z } from 'zod';

const addMuseumReqSchema = z
	.object({
		name: z
			.string({
				invalid_type_error: 'name must be a string',
				required_error: 'name is required',
			})
			.nonempty(),
		osmType: z
			.string({
				invalid_type_error: 'osmType must be a string',
				required_error: 'osmType is required',
			})
			.regex(new RegExp('^[NWR]$'), {
				message: 'osmType must be a string and be one of: N, W, R',
			})
			.toUpperCase()
			.nonempty(),
		osmid: z.number({
			required_error: 'osmid is required',
			invalid_type_error: 'osmid must be an integer',
		}),
	})
	.strict();

export class AddMuseumRequestDTOValidator extends GenericValidator<AddMuseumRequestDTO> {
	constructor() {
		super(addMuseumReqSchema);
	}
}

export const addMuseumRequestDTOValidator = new AddMuseumRequestDTOValidator();
