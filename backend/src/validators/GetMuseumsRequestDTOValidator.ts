import { GetMuseumsRequestDTO } from '@xintre/shared';
import { ValidationError } from './types';
import { z } from 'zod';

const listMuseumsReqSchema = z
	.object({
		pageSize: z.string({
			invalid_type_error: 'pageSize must be a string number',
		}),
	})
	.strict();

export class GetMuseumsRequestDTOValidator {
	/**
	 * Validates the GetMuseumsRequestDTO
	 *
	 * @param dto the DTO to validate
	 * @returns `z.ZodError` if failed, or undefined if validated successfully
	 */
	static validate(dto: GetMuseumsRequestDTO): ValidationError | undefined {
		const result = listMuseumsReqSchema.safeParse(dto);
		return result.success
			? undefined
			: { validationErrors: result.error.issues };
	}
}
