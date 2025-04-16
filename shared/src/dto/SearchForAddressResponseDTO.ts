export type AddressDTO = {
	name: string;
	osmid: number;
	display_name: string;
	lon: number;
	lat: number;
};

export type SearchForAddressResponseDTO = {
	addresses: AddressDTO[];
	page: number;
	totalPages: number;
};
