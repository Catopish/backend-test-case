import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Book } from './book.entity';
import { BooksRepository } from './books.repository';
import { postBookDto } from './dto/postBook.dto';
import { MembersRepository } from 'src/members/members.repository';
import { transactionBookDto } from './dto/transactionBook.dto';

@Injectable()
export class BooksService {
  constructor(
    private booksRepository: BooksRepository,
    private membersRepository: MembersRepository,
  ) {}

  postBook(postBookDTO: postBookDto): Promise<Book> {
    return this.booksRepository.postBook(postBookDTO);
  }

  async getBooks() {
    return this.booksRepository.getBooks();
  }

  async borrowBook(borrowBookDTO: transactionBookDto) {
    const { memberCode, bookCode } = borrowBookDTO;
    const member = await this.membersRepository.findOne({
      where: { code: memberCode },
      relations: ['book'],
    });

    console.log(member.borrowedBooksNum);
    if (!member) throw new NotFoundException('Bad Request');
    if (member.isPenalized) throw new ConflictException('Member is penalized');
    if (member.borrowedBooksNum >= 2) {
      throw new HttpException(
        "Member can't borrow more books",
        HttpStatus.FORBIDDEN,
      );
    }
    const book = await this.booksRepository.findOne({
      where: { code: bookCode },
    });

    if (!book) {
      throw new NotFoundException(`Book with code ${bookCode} not found`);
    }

    if (book.member) {
      throw new ConflictException('Book is already borrowed by another member');
    }
    if (book.stock === 0) {
      throw new NotFoundException('Empty Stock');
    }

    member.borrowedBooksNum += 1;
    member.book.push(book);
    book.member = member;
    book.borrowedDate = new Date();
    book.isBooked = true;
    book.stock -= 1;
    await this.booksRepository.save(book);
    await this.membersRepository.save(member);
  }

  async returnBook(returnBookDTO: transactionBookDto) {
    const { memberCode, bookCode } = returnBookDTO;
    const member = await this.membersRepository.findOne({
      where: { code: memberCode },
      relations: ['book'],
    });

    const book = await this.booksRepository.findOne({
      where: { code: bookCode },
      relations: ['member'],
    });
    if (!member)
      throw new NotFoundException(`Member with code ${memberCode} Not Found`);

    if (!book) {
      throw new NotFoundException(`Book not with code ${memberCode} found`);
    }
    if (book.member.id !== member.id) {
      throw new ConflictException('This book was not borrowed by this member');
    }
    const borrowDuration =
      (new Date().getTime() - book.borrowedDate.getTime()) / (1000 * 3600 * 24);
    if (borrowDuration > 7) {
      member.isPenalized = true;
      member.penaltyUntil = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    }

    member.borrowedBooksNum -= 1;
    member.book = member.book.filter((b) => b.code !== book.code);
    book.member = null;
    book.borrowedDate = null;
    book.isBooked = false;
    book.stock += 1;

    await this.booksRepository.save(book);
    await this.membersRepository.save(member);
  }
}
