import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

import { Museum } from './Museum';
import { Rate } from '@xintre/shared';

@Entity()
export class Visit extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	/**
	 * Date of visit
	 */
	@Column()
	dateOfVisit!: Date;

	/**
	 * Rate of visit
	 */
	@Column({
		type: 'enum',
		enum: Rate,
	})
	rate!: Rate;

	/**
	 * Museum of visit
	 */
	@ManyToOne(() => Museum, (museum) => museum.visits)
	museum!: Museum;
}
