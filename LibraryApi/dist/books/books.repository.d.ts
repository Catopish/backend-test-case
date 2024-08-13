import { DataSource, Repository } from 'typeorm';
import { Book } from './book.entity';
import { postBookDto } from './dto/postBook.dto';
export declare class BooksRepository extends Repository<Book> {
    private datasource;
    constructor(datasource: DataSource);
    postBook(postBookDTO: postBookDto): Promise<Book>;
    getBooks(): Promise<Book[]>;
}
