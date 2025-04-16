import { AddMuseumRequestDTO } from '@xintre/shared';
import { ValidationError } from './types';
import { z } from 'zod';

const addMuseumReqSchema = z
	.object({
		name: z
			.string({
				invalid_type_error: 'Name must be a string',
				required_error: 'Name is required',
			})
			.nonempty(),
		osmid: z
			.number({
				required_error: 'OSMID is required',
				invalid_type_error: 'OSMID must be an integer',
			})
			.int(),
	})
	.strict();

export class addMuseumRequestDTOValidator {
	/**
	 * Validates the AddMuesumRequestDTO
	 *
	 * @param dto the DTO to validate
	 * @returns `z.ZodError` if failed, or undefined if validated successfully
	 */
	static validate(dto: AddMuseumRequestDTO): ValidationError | undefined {
		const result = addMuseumReqSchema.safeParse(dto);
		return result.success
			? undefined
			: { validationErrors: result.error.issues };
	}
}
