import { NominatimPlaceLookupResponseDTO } from '@xintre/shared';
import axios from 'axios';

export class NominatimService {
	static async lookupPlace({
		osmType,
		osmid,
	}: {
		osmType: string;
		osmid: number;
	}) {
		const response = await axios.get<NominatimPlaceLookupResponseDTO>(
			'https://nominatim.openstreetmap.org/lookup',
			{
				params: {
					osm_ids: `${osmType}${osmid}`,
					format: 'json',
				},
				headers: {
					'User-Agent': process.env.NOMINATIM_USER_AGENT,
				},
			},
		);

		// always take the first match
		const maybeMatches = response.data;
		return maybeMatches?.[0];
	}
}
