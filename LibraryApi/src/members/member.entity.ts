import { Book } from 'src/books/book.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['code'])
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  borrowedBooksNum: number;

  @Column({ default: false })
  isPenalized: boolean;

  @Column({ nullable: true })
  penaltyUntil: Date | null;

  @OneToMany(() => Book, (book) => book.member, { eager: true })
  book: Book[];
}
