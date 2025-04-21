import { GenericValidator } from '../GenericValidator';
import { GetMuseumsRequestDTO } from '@xintre/shared';
import { partialPaginationDTOValidator } from '../partials';

const listMuseumsReqSchema = partialPaginationDTOValidator.extend({});

export class GetMuseumsRequestDTOValidator extends GenericValidator<GetMuseumsRequestDTO> {
	constructor() {
		super(listMuseumsReqSchema);
	}
}

export const getMuseumsRequestDTOValidator =
	new GetMuseumsRequestDTOValidator();
