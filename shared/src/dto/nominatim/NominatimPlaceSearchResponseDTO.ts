export type NominatimPlaceSearchResponseDTO = {
	place_id: number;
	licence: string;
	osm_type: string;
	osm_id: number;
	lat: number;
	lon: number;
	category: string;
	type: string;
	place_rank: number;
	importance: number;
	addresstype: string;
	name: string;
	display_name: string;
	boundingbox: [number, number, number, number];
};
