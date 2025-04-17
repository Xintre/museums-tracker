import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

import { AddressInfo } from '@xintre/shared';

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
	})
	longitude!: string;

	/**
	 * Latitude from OpenStreetMap
	 */
	@Column({
		nullable: false,
	})
	latitude!: string;

	/**
	 * Date of record creation
	 */
	@CreateDateColumn()
	createdAt!: Date;
}
