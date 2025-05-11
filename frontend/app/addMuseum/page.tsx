'use client';

import {
	AddMuseumRequestDTO,
	AddMuseumResponseDTO,
	SearchForAddressResponseDTO,
} from '@xintre/shared';
import {
	Avatar,
	CircularProgress,
	Container,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { fetchGET, fetchPOST } from '@/utils/apiClient';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { OpenInBrowser } from '@mui/icons-material';
import _ from 'lodash';
import { useDebounce } from '@uidotdev/usehooks';
import { useRouter } from 'next/navigation';

export default function AddMuseum() {
	const { back } = useRouter();

	const [query, setQuery] = useState<string>('');

	const queryDebounced = useDebounce(query, 250);

	const {
		isError: isSearchError,
		error: searchError,
		isLoading: isSearching,
		data: searchResponse,
	} = useQuery({
		enabled: queryDebounced.trim().length > 0,
		queryKey: ['museum-search', queryDebounced],
		staleTime: 5 * 60 * 1000, // consider cached data up-to-date for 5 mins
		queryFn: async () => {
			const response = await fetchGET<SearchForAddressResponseDTO>({
				url: `/api/museum/search?query=${queryDebounced}`,
			});

			return response.data;
		},
	});

	const {
		mutate: addMuseum,
		isPending: isAdding,
		isError: isAddError,
		error: addError,
	} = useMutation({
		mutationKey: ['add-museum', queryDebounced],
		mutationFn: async ({
			osmid,
			osmType,
		}: {
			osmid: number;
			osmType: string;
		}) => {
			const response = await fetchPOST<
				AddMuseumRequestDTO,
				AddMuseumResponseDTO
			>({
				url: '/api/museum',
				body: {
					name: queryDebounced,
					osmid,
					osmType,
				},
			});

			return response.data;
		},
		onSuccess() {
			back();
		},
	});

	// search error log effect
	useEffect(() => {
		if (isSearchError) {
			console.error('Error searching for museum', searchError);
		}
	}, [searchError, isSearchError]);

	// add museum error log effect
	useEffect(() => {
		if (isAddError) {
			console.error('Error adding museum', addError);
		}
	}, [addError, isAddError]);

	return (
		<Container>
			<Stack
				justifyContent="center"
				alignItems="center"
				padding="3rem"
				spacing={3}
			>
				<TextField
					label="Museum name"
					variant="filled"
					value={query}
					onChange={(event) => {
						setQuery(event.target.value);
					}}
				/>

				{isSearching || isAdding ? (
					<CircularProgress size="5rem" />
				) : isSearchError || isAddError ? (
					<Typography variant="h4" color="error" textAlign="center">
						Error {isSearchError ? 'loading' : 'adding museum'}{' '}
						data, please reload page
					</Typography>
				) : (
					<>
						{searchResponse?.length === 0 && (
							<Typography
								textAlign="center"
								style={{ marginBottom: 10 }}
							>
								No museums on the list yet 😥
							</Typography>
						)}

						<List>
							{searchResponse?.map((match) => (
								<ListItem
									key={match.osm_id}
									secondaryAction={
										<IconButton
											edge="end"
											onClick={() => {
												addMuseum({
													osmid: match.osm_id,
													osmType: _.capitalize(
														match.osm_type[0],
													),
												});
											}}
										>
											<OpenInBrowser />
										</IconButton>
									}
								>
									<ListItemAvatar>
										<Avatar>
											{match.name.substring(0, 2)}
										</Avatar>
									</ListItemAvatar>

									<ListItemText
										primary={match.name}
										secondary={match.display_name}
									/>
								</ListItem>
							))}
						</List>
					</>
				)}
			</Stack>
		</Container>
	);
}
