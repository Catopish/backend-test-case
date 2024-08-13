import { Book } from 'src/books/book.entity';
export declare class Member {
    id: number;
    code: string;
    name: string;
    borrowedBooksNum: number;
    isPenalized: boolean;
    penaltyUntil: Date | null;
    book: Book[];
}
