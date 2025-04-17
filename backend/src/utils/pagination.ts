/**
 * Sanitizes the pagination state by calculating the total no of pages & keeping the page index within
 * database bounds
 * @param options the options containing information on the state of the query / database
 * @returns the sanitized pagination state
 */
export function ensurePaginationParamsInBounds({
	pageSize,
	page,
	totalCount,
}: Record<'pageSize' | 'page' | 'totalCount', number>) {
	const totalPages = Math.ceil(totalCount / pageSize);

	return {
		page: Math.min(page, Math.max(0, totalPages - 1)),
		totalPages,
	};
}
