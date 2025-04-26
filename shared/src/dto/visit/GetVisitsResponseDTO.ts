import { Rate } from '../../enums';

export type VisitDTO = {
	dateOfVisit: Date;
	rate: Rate;
};

export type GetVisitsResponseDTO = {
	visits: VisitDTO[];
	numberOfVisits: number;
	avgRate: number;
};
