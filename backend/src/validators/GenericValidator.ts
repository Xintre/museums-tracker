import { ValidationError } from './types';
import { z } from 'zod';

export class GenericValidator<T> {
	constructor(private schema: z.Schema) {}

	/**
	 * Validates the given DTO
	 *
	 * @param dto the DTO to validate
	 * @returns `z.ZodError` if failed, or undefined if validated successfully
	 */
	validate(dto: T): ValidationError | undefined {
		const result = this.schema.safeParse(dto);
		return result.success
			? undefined
			: { validationErrors: result.error.issues };
	}
}
