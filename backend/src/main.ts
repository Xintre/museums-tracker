import 'dotenv/config';
import 'reflect-metadata';

import express, { Request, Response } from 'express';

import { AppDataSource } from '@/database/data-source';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { museumRouter } from '@/routers/museumRouter';
import process from 'process';
import signale from 'signale';
import { visitRouter } from './routers/visitRouter';

async function main() {
	await AppDataSource.initialize();

	const app = express();
	app.use(helmet());
	app.use(cors());
	app.use(express.json());

	app.use(morgan('combined'));

	const PORT = process.env.PORT ?? 8000;

	app.listen(PORT, () => {
		signale.success(`Server running on port ${PORT}`);
	});

	app.use('/api/museum', museumRouter);
	app.use('/api/visit', visitRouter);

	// 404 middleware - must be at the end of the file!
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	app.use((_req, res, _next) => {
		res.status(404).send('404 Not Found - please try something else');
	});

	// 500 ISE middleware - must be at the end of the file!
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	app.use((err: Error, _req: Request, res: Response, _next: unknown) => {
		console.error(err.stack);
		res.status(500).send('500 ISE - something went wrong');
	});
}

main();
