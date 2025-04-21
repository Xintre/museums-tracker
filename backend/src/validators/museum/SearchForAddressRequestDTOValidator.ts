import { GenericValidator } from '../GenericValidator';
import { SearchForAddressRequestDTO } from '@xintre/shared';
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

export class SearchForAddressRequestDTOValidator extends GenericValidator<SearchForAddressRequestDTO> {
	constructor() {
		super(searchForAddressReqSchema);
	}
}

export const searchForAddressRequestDTOValidator =
	new SearchForAddressRequestDTOValidator();
