import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

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
	})
	osmid!: number;

	/**
	 * Full merged address from OpenStreetMap
	 */
	@Column({
		nullable: false,
	})
	address!: string;

	/**
	 * Longitude from OpenStreetMap
	 */
	@Column({
		nullable: false,
	})
	longitude!: number;

	/**
	 * Latitude from OpenStreetMap
	 */
	@Column({
		nullable: false,
	})
	latitude!: number;

	/**
	 * Date of record creation
	 */
	@CreateDateColumn()
	createdAt!: Date;
}
