import { SearchForAddressRequestDTO } from '@xintre/shared';
import { ValidationError } from './types';
import { z } from 'zod';

const searchForAddressReqSchema = z
	.object({
		query: z
			.string({
				required_error: 'query is required',
				invalid_type_error: 'query must be of string type',
			})
			.nonempty(),
	})
	.strict();

export class SearchForAddressRequestDTOValidator {
	/**
	 * Validates the SearchForAddressRequestDTO
	 *
	 * @param dto the DTO to validate
	 * @returns `z.ZodError` if failed, or undefined if validated successfully
	 */
	static validate(
		dto: SearchForAddressRequestDTO,
	): ValidationError | undefined {
		const result = searchForAddressReqSchema.safeParse(dto);
		return result.success
			? undefined
			: { validationErrors: result.error.issues };
	}
}
