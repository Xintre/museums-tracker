import { z } from 'zod';

export const partialPaginationDTOValidator = z
	.object({
		pageSize: z
			.number({
				invalid_type_error: 'pageSize must be a number',
			})
			.min(1)
			.max(50),
		page: z
			.number({
				invalid_type_error: 'page must be a number',
			})
			.min(0),
	})
	.strict();
