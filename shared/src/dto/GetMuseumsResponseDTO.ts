import { AddressInfo } from './nominatim';

export type MuseumDTO = {
	id: number;
	name: string;
	osmid: string;
	address: AddressInfo;
	longitude: number;
	latitude: number;
	createdAt: Date;
};

export type GetMuseumsResponseDTO = {
	museums: MuseumDTO[];
	page: number;
	totalPages: number;
};
