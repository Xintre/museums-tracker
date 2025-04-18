import { AddressInfo } from '../dto';

export function stringifyAddressInfo(address: AddressInfo) {
	return `${address.country}, ${address.postcode} ${address.city}, ${address.house_number} ${address.road}`;
}
