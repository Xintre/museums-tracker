import 'reflect-metadata';

import { Museum, Visit } from './entity';

import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DATABASE_HOST,
	port: Number(process.env.DATABASE_PORT),
	username: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	synchronize: true,
	logging: true,
	entities: [Museum, Visit],
	migrations: [],
	subscribers: [],
});
