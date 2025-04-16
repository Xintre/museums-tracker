export type MuseumDTO = {
	id: number;
	name: string;
	osmid: number;
	address: string;
	longitude: number;
	latitude: number;
	createdAt: Date;
};

export type ListMuseumsResponseDTO = {
	museums: MuseumDTO[];
	page: number;
	totalPages: number;
};
