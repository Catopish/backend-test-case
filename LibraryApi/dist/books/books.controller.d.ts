import { BooksService } from './books.service';
import { postBookDto } from './dto/postBook.dto';
import { transactionBookDto } from './dto/transactionBook.dto';
export declare class BooksController {
    private BooksService;
    constructor(BooksService: BooksService);
    postBooks(postBookDTO: postBookDto): Promise<import("./book.entity").Book>;
    getBooks(): Promise<import("./book.entity").Book[]>;
    borrowBook(borrowBookDTO: transactionBookDto): Promise<void>;
    returnBook(returnBookDTO: transactionBookDto): Promise<void>;
}
