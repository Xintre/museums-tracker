import { AddressInfo } from './AddressInfo';

export type NominatimSinglePlaceLookupResultDTO = {
	osm_id: number;
	lat: string;
	lon: string;
	address: AddressInfo;
};

export type NominatimPlaceLookupResponseDTO =
	| NominatimSinglePlaceLookupResultDTO[]
	| undefined;
