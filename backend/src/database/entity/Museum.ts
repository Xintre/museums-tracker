import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

import { AddressInfo } from '@xintre/shared';
import { Visit } from './Visit';

@Entity()
export class Museum extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	/**
	 * User's chosen name of the museum
	 */
	@Column({
		nullable: false,
	})
	name!: string;

	/**
	 * OpenStreetMap ID of the place
	 */
	@Column({
		nullable: false,
		unique: true,
		type: 'bigint',
	})
	osmid!: number;

	/**
	 * Full merged address from OpenStreetMap
	 */
	@Column({
		nullable: false,
		type: 'json',
	})
	address!: AddressInfo;

	/**
	 * Longitude from OpenStreetMap
	 */
	@Column({
		nullable: false,
		type: 'double precision',
	})
	longitude!: number;

	/**
	 * Latitude from OpenStreetMap
	 */
	@Column({
		nullable: false,
		type: 'double precision',
	})
	latitude!: number;

	/**
	 * Date of record creation
	 */
	@CreateDateColumn()
	createdAt!: Date;

	/**
	 * Visits' Ratings
	 */
	@OneToMany(() => Visit, (visit) => visit.museum, { onDelete: 'CASCADE' })
	visits!: Visit[];
}
