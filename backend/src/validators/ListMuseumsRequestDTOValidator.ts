import { ListMuseumsRequestDTO } from '@xintre/shared';
import { ValidationError } from './types';
import { z } from 'zod';

const listMuseumsReqSchema = z
	.object({
		search: z
			.string({
				invalid_type_error: 'search must be a string or undefined',
			})
			.nonempty()
			.optional(),
		pageSize: z
			.number({
				invalid_type_error: 'pageSize must be an integer',
				required_error: 'pageSize is required',
			})
			.int(),
	})
	.strict();

export class ListMuseumsRequestDTOValidator {
	/**
	 * Validates the ListMuseumsRequestDTO
	 *
	 * @param dto the DTO to validate
	 * @returns `z.ZodError` if failed, or undefined if validated successfully
	 */
	static validate(dto: ListMuseumsRequestDTO): ValidationError | undefined {
		const result = listMuseumsReqSchema.safeParse(dto);
		return result.success
			? undefined
			: { validationErrors: result.error.issues };
	}
}
