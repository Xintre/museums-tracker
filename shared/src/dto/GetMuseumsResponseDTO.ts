export type MuseumDTO = {
	id: number;
	name: string;
	osmid: string;
	address: string;
	longitude: string;
	latitude: string;
	createdAt: Date;
};

export type GetMuseumsResponseDTO = {
	museums: MuseumDTO[];
	page: number;
	totalPages: number;
};
