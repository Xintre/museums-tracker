'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export function BackButton() {
	const router = useRouter();

	return (
		<Button
			style={{
				color: 'background',
				borderColor: 'background',
			}}
			variant="outlined"
			startIcon={<ArrowBackIcon />}
			onClick={() => {
				router.back();
			}}
		>
			Go back
		</Button>
	);
}
