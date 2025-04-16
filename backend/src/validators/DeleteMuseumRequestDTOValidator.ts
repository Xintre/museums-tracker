import { DeleteMuseumRequestDTO } from '@xintre/shared';
import { ValidationError } from './types';
import { z } from 'zod';

const deleteMuseumReqSchema = z
	.object({
		id: z
			.number({
				required_error: 'ID is required',
				invalid_type_error: 'ID must be of integer type',
			})
			.int(),
	})
	.strict();

export class DeleteMuseumRequestDTOValidator {
	/**
	 * Validates the DeleteMuseumRequestDTO
	 *
	 * @param dto the DTO to validate
	 * @returns `z.ZodError` if failed, or undefined if validated successfully
	 */
	static validate(dto: DeleteMuseumRequestDTO): ValidationError | undefined {
		const result = deleteMuseumReqSchema.safeParse(dto);
		return result.success
			? undefined
			: { validationErrors: result.error.issues };
	}
}
