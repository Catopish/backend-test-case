import { Member } from 'src/members/member.entity';
export declare class Book {
    code: string;
    title: string;
    author: string;
    stock: number;
    isBooked: boolean;
    borrowedDate: Date | null;
    member: Member;
}
