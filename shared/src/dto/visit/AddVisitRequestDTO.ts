import { Rate } from '../../enums';

export type AddVisitRequestDTO = {
	rate: Rate;
	dateOfVisit: Date;
	museumId: number;
};
