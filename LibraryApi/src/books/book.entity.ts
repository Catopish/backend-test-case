import { Member } from 'src/members/member.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryColumn()
  code: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  stock: number;

  @Column({ default: false })
  isBooked: boolean;

  @Column({ nullable: true })
  borrowedDate: Date | null;

  @ManyToOne(() => Member, (member) => member.book, { eager: false })
  member: Member;
}
