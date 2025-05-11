import {
	BaseEntity,
	Check,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

import { Museum } from './Museum';

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
		type: 'int',
	})
	@Check('rate >= 1 AND rate <= 5')
	rate!: number;

	/**
	 * Museum of visit
	 */
	@ManyToOne(() => Museum, (museum) => museum.visits)
	museum!: Museum;
}
