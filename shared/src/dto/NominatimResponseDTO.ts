export type NominatimResponseRecordDTO = {
	osm_id: number;
	lat: string;
	lon: string;
	address: string;
};

export type NominatimResponseDTO = NominatimResponseRecordDTO[];
