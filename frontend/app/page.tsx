'use client';

import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	CircularProgress,
	Container,
	IconButton,
	Pagination,
	Stack,
	Typography,
	useTheme,
} from '@mui/material';
import { Button, Grid } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import {
	DeleteMuseumRequestDTO,
	DeleteMuseumResponseDTO,
	EditMuseumRequestDTO,
	EditMuseumResponseDTO,
	GetMuseumsResponseDTO,
} from '@xintre/shared';
import React, { useState } from 'react';
import { fetchDELETE, fetchGET, fetchPATCH } from '@/utils/apiClient';
import { useMutation, useQuery } from '@tanstack/react-query';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FaintDivider } from '@/components/FaintDivider';
import MuseumIcon from '@mui/icons-material/Museum';
import TextField from '@mui/material/TextField';
import dynamic from 'next/dynamic';
import moment from 'moment';
import { stringifyAddressInfo } from '@xintre/shared';
import { useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/navigation';

const MuseumsMap = dynamic(() => import('@/components/MuseumsMap'), {
	ssr: false,
});

export default function MuseumMap() {
	const theme = useTheme();
	const { push: routerPush } = useRouter();
	const isMdOrSmaller = useMediaQuery(theme.breakpoints.down('md'));

	const [page, setPage] = useState(0);
	const [totalPages, setTotalPages] = useState(6);

	const [newName, setNewName] = useState<string>('');
	const [open, setOpen] = React.useState(false);
	const [editingMuseumId, setEditingMuseumId] = useState<number | null>(null);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const {
		isError,
		error,
		isLoading,
		refetch,
		data: museumsResponse,
	} = useQuery({
		queryKey: ['museums-list', page],
		queryFn: async () => {
			const query = new URLSearchParams();

			query.set('pageSize', (6).toString());
			query.set('page', page.toString());

			const response = await fetchGET<GetMuseumsResponseDTO>({
				url: `/api/museum?${query.toString()}`,
			});

			return response.data;
		},
	});

	// sanitize page & pageSize on every query response
	useEffect(() => {
		if (!museumsResponse) return;

		setPage(museumsResponse.page);
		setTotalPages(museumsResponse.totalPages);
	}, [museumsResponse]);

	// log fetching error effect
	useEffect(() => {
		if (isError) {
			console.error('Error getting museums', error);
		}
	}, [error, isError]);

	const {
		mutate: deleteMuseum,
		isPending: isDeleting,
		isError: isDeleteError,
		error: deleteError,
	} = useMutation({
		mutationKey: ['delete-museum'],
		mutationFn: async (id: number) => {
			const response = await fetchDELETE<
				DeleteMuseumRequestDTO,
				DeleteMuseumResponseDTO
			>({
				url: '/api/museum',
				body: {
					id,
				},
			});

			return response.data;
		},
		onSuccess() {
			refetch();
		},
	});

	// log delete error effect
	useEffect(() => {
		if (isDeleteError) {
			console.error('Error deleting museum', deleteError);
		}
	}, [deleteError, isDeleteError]);

	const {
		mutate: editMuseum,
		isPending: isEditing,
		isError: isEditError,
		error: editError,
	} = useMutation({
		mutationKey: ['edit-museum', newName],
		mutationFn: async (id: number) => {
			const response = await fetchPATCH<
				EditMuseumRequestDTO,
				EditMuseumResponseDTO
			>({
				url: '/api/museum',
				body: {
					id,
					name: newName,
				},
			});

			return response.data;
		},
		onSuccess() {
			refetch();
		},
	});

	// log delete error effect
	useEffect(() => {
		if (isEditError) {
			console.error('Error editinng museum', editError);
		}
	}, [editError, isEditError]);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				width: '90%',
				height: '100%',
			}}
		>
			<Grid
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					width: '100%',
				}}
			>
				<Grid flex={4}></Grid>
				<Grid flex={4} textAlign={'center'}>
					<h2 style={{ fontWeight: 'normal' }}>
						See your museums 🎨
					</h2>
				</Grid>
				<Grid flex={4} textAlign={'right'}>
					<Button
						variant="contained"
						endIcon={<MuseumIcon />}
						onClick={() => {
							routerPush('/addMuseum');
						}}
					>
						Add a Museum to your list
					</Button>
				</Grid>
			</Grid>

			<FaintDivider orientation="horizontal" />

			<Grid
				container
				direction="row"
				justifyContent="space-evenly"
				width="100%"
				paddingBottom={0.1}
			>
				<Grid
					size={{ md: 5.5, sm: 12 }}
					display={'flex'}
					flexDirection={'column'}
				>
					<MuseumsMap museums={museumsResponse?.museums} />
				</Grid>

				<Grid
					size={{ sm: isMdOrSmaller ? 12 : 1 }}
					justifyContent="center"
					display="flex"
				>
					<FaintDivider
						orientation={isMdOrSmaller ? 'horizontal' : 'vertical'}
					/>
				</Grid>

				<Grid size={{ md: 5.5, sm: 12 }}>
					<Container>
						<Stack
							justifyContent="center"
							alignItems="center"
							padding="3rem"
						>
							{isLoading || isDeleting || isEditing ? (
								<CircularProgress size="5rem" />
							) : isError || isDeleteError ? (
								<Typography
									variant="h4"
									color="error"
									textAlign="center"
								>
									Error{' '}
									{isDeleteError
										? 'deleting'
										: isEditError
											? 'editing'
											: 'loading'}{' '}
									data, please reload page
								</Typography>
							) : (
								<>
									{museumsResponse?.museums.length === 0 && (
										<Typography
											textAlign="center"
											style={{ marginBottom: 10 }}
										>
											No museums on the list yet 😥
										</Typography>
									)}

									{museumsResponse?.museums?.map((museum) => (
										<Accordion
											key={museum.id}
											style={{ width: '100%' }}
										>
											<AccordionSummary
												expandIcon={<ExpandMoreIcon />}
											>
												<div
													style={{
														display: 'flex',
														flex: 1,
														justifyContent:
															'space-between',
														alignItems: 'center',
													}}
												>
													<Stack>
														<Typography
															component="div"
															variant="h6"
														>
															{museum.name}
														</Typography>

														<Typography
															component="div"
															variant="subtitle1"
														>
															(
															{museum.address.city
																? `${
																		museum
																			.address
																			.city
																	}, `
																: ''}
															{
																museum.address
																	.country
															}
															)
														</Typography>
													</Stack>

													<Typography
														component="div"
														variant="caption"
														color="textSecondary"
														style={{
															textAlign: 'right',
															whiteSpace:
																'nowrap',
														}}
													>
														{moment(
															museum.createdAt,
														).format(
															'DD.MM.YYYY HH:mm:ss',
														)}
													</Typography>
												</div>
											</AccordionSummary>

											<AccordionDetails>
												<Typography variant="subtitle2">
													Museum: {museum.name}
												</Typography>

												<Typography
													component="div"
													variant="subtitle1"
												>
													{stringifyAddressInfo(
														museum.address,
													)}
												</Typography>
												<Grid
													style={{
														display: 'flex',
														flexDirection: 'row',
														justifyContent: 'end',
														alignItems: 'center',
														width: '100%',
													}}
												>
													<IconButton
														onClick={() => {
															deleteMuseum(
																museum.id,
															);
														}}
													>
														<Delete />
													</IconButton>
													<IconButton
														onClick={() => {
															setEditingMuseumId(
																museum.id,
															);
															setNewName('');
															handleClickOpen();
														}}
													>
														<Edit />
													</IconButton>
												</Grid>
											</AccordionDetails>
										</Accordion>
									))}

									<Pagination
										sx={{
											marginTop: 2,
										}}
										count={totalPages}
										showFirstButton
										showLastButton
										page={page + 1}
										onChange={(event, page) => {
											setPage(page - 1);
										}}
									/>
								</>
							)}
						</Stack>
					</Container>
					<Dialog
						open={open}
						onClose={handleClose}
						slotProps={{
							paper: {
								component: 'form',
								onSubmit: (
									event: React.FormEvent<HTMLFormElement>,
								) => {
									event.preventDefault();
									if (editingMuseumId !== null) {
										editMuseum(editingMuseumId);
									}
									handleClose();
								},
							},
						}}
					>
						<DialogTitle>Edit Museum&apos;s name ✏️</DialogTitle>
						<DialogContent>
							<DialogContentText>
								Please pass new name for the museum.
							</DialogContentText>
							<TextField
								autoFocus
								required
								margin="dense"
								id="name"
								name="museums-name"
								label="New name"
								fullWidth
								variant="standard"
								value={newName}
								onChange={(event) => {
									setNewName(event.target.value);
								}}
							/>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleClose}>Cancel</Button>
							<Button
								type="submit"
								disabled={!editingMuseumId || !newName.trim()}
							>
								Submit
							</Button>
						</DialogActions>
					</Dialog>
				</Grid>
			</Grid>
		</div>
	);
}
