import { Book } from './book.entity';
import { BooksRepository } from './books.repository';
import { postBookDto } from './dto/postBook.dto';
import { MembersRepository } from 'src/members/members.repository';
import { transactionBookDto } from './dto/transactionBook.dto';
export declare class BooksService {
    private booksRepository;
    private membersRepository;
    constructor(booksRepository: BooksRepository, membersRepository: MembersRepository);
    postBook(postBookDTO: postBookDto): Promise<Book>;
    getBooks(): Promise<Book[]>;
    borrowBook(borrowBookDTO: transactionBookDto): Promise<{
        success: boolean;
        message: string;
    }>;
    returnBook(returnBookDTO: transactionBookDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
