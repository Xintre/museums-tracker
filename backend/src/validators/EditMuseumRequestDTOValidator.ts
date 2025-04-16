import { EditMuseumRequestDTO } from '@xintre/shared';
import { ValidationError } from './types';
import { z } from 'zod';

const editMuseumReqSchema = z
	.object({
		id: z
			.number({
				invalid_type_error: 'ID must be an integer',
				required_error: 'ID is required',
			})
			.int(),
		name: z
			.string({
				required_error: 'Name is required',
				invalid_type_error: 'Name must be an integer',
			})
			.nonempty(),
	})
	.strict();

export class EditMuseumRequestValidator {
	/**
	 * Validates the EditMuseumRequestDTO
	 *
	 * @param dto the DTO to validate
	 * @returns `z.ZodError` if failed, or undefined if validated successfully
	 */
	static validate(dto: EditMuseumRequestDTO): ValidationError | undefined {
		const result = editMuseumReqSchema.safeParse(dto);
		return result.success
			? undefined
			: { validationErrors: result.error.issues };
	}
}
