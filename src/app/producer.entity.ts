import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Producer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  studios!: string;

  @Column()
  producers!: string;

  @Column()
  year!: number;

  @Column()
  winner!: string;
}