import { AddressInfo } from './AddressInfo';

export type NominatimSinglePlaceLookupResultDTO = {
	osm_id: number;
	lat: number;
	lon: number;
	address: AddressInfo;
};

export type NominatimPlaceLookupResponseDTO =
	| NominatimSinglePlaceLookupResultDTO[]
	| undefined;
