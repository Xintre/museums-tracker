/**
 * Creates a URL to the API using the URI passed in
 * @param uri The URI to query for
 */
function makeURL(uri: string): string {
	return new URL(uri, 'http://localhost:8000').toString();
}

export type CreateBaseRequestOptions = {
	url: string;
};

async function fetchBase<Response>(
	{ url }: CreateBaseRequestOptions,
	fetchOptions?: RequestInit,
) {
	const response = await fetch(makeURL(url), fetchOptions);

	if (response.status >= 400) {
		throw new Error(response.status.toString());
	}

	return {
		statusCode: response.status,
		statusText: response.statusText,
		data: (await response.json()) as Response,
	};
}

export type FetchGetOptions = CreateBaseRequestOptions & {};

export async function fetchGET<Response>(requestOptions: FetchGetOptions) {
	return await fetchBase<Response>(requestOptions);
}

export type FetchPostOptions<Body> = CreateBaseRequestOptions & {
	body: Body;
};

export async function fetchPOST<Body, Response>({
	body,
	...requestOptions
}: FetchPostOptions<Body>) {
	return await fetchBase<Response>(requestOptions, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
}

export type FetchDeleteOptions<Body> = CreateBaseRequestOptions & {
	body: Body;
};

export async function fetchDELETE<Body, Response>({
	body,
	...requestOptions
}: FetchDeleteOptions<Body>) {
	return await fetchBase<Response>(requestOptions, {
		method: 'DELETE',
		body: JSON.stringify(body),
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
}
