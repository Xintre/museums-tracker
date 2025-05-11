export type VisitDTO = {
	dateOfVisit: Date;
	rate: number;
};

export type GetVisitsResponseDTO = {
	visits: VisitDTO[];
	numberOfVisits: number;
	avgRate: number;
};
