import 'leaflet/dist/leaflet.css';

import { CircularProgress, Typography } from '@mui/material';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useEffect, useState } from 'react';

import L from 'leaflet';
import { MuseumDTO } from '@xintre/shared';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { stringifyAddressInfo } from '@xintre/shared';

L.Icon.Default.mergeOptions({
	iconRetinaUrl: markerIcon2x.src ?? markerIcon2x,
	iconUrl: markerIcon.src ?? markerIcon,
	shadowUrl: markerShadow.src ?? markerShadow,
});

export type MuseumsMapProps = {
	museums?: MuseumDTO[];
};

export default function MuseumsMap({ museums }: MuseumsMapProps) {
	const [center, setCenter] = useState<L.LatLng | null>(null);
	const [zoom, setZoom] = useState<number>(1);

	useEffect(() => {
		function fallback() {
			setCenter(new L.LatLng(0, 0));
			setZoom(1); // view of the whole globe
		}

		if (!navigator.geolocation) {
			fallback();
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				setCenter(new L.LatLng(latitude, longitude));
				setZoom(13); // view in close
			},
			(error) => {
				console.warn('Could not get location:', error);

				fallback();
			},
		);
	}, []);

	return center === null ? (
		<CircularProgress />
	) : (
		<MapContainer
			center={center}
			zoom={zoom}
			scrollWheelZoom={true}
			style={{ height: '40rem', width: '100%' }}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			{museums?.map((museum) => (
				<Marker
					key={museum.id}
					position={[museum.latitude, museum.longitude]}
				>
					<Popup>
						<Typography variant="h6">{museum.name}</Typography>
						<Typography variant="caption">
							{stringifyAddressInfo(museum.address)}
						</Typography>
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
}
