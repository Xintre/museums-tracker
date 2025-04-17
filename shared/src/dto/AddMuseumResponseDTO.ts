import { AddressInfo } from './nominatim';

export type AddMuseumResponseDTO = {
	id: number;
	name: string;
	address: AddressInfo;
};
