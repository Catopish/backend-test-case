import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Book } from './book.entity';
import { postBookDto } from './dto/postBook.dto';

@Injectable()
export class BooksRepository extends Repository<Book> {
  constructor(private datasource: DataSource) {
    super(Book, datasource.createEntityManager());
  }

  async postBook(postBookDTO: postBookDto): Promise<Book> {
    const { code, title, author, stock } = postBookDTO;

    const book = this.create({
      code,
      title,
      author,
      stock,
    });

    await this.save(book);
    return book;
  }

  async getBooks(): Promise<Book[]> {
    const query = this.createQueryBuilder('book');
    query.where({ isBooked: false });
    const books = await query.getMany();
    return books;
  }
}
