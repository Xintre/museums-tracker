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
		unique: true,
	})
	osmid!: string;

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
