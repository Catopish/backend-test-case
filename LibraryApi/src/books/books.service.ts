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
    let isPenalizedMessage = '';
    const { memberCode, bookCode } = borrowBookDTO;
    const member = await this.membersRepository.findOne({
      where: { code: memberCode },
      relations: ['book'],
    });

    //NOTE: checking if member exists
    if (!member) throw new NotFoundException('Bad Request');

    //NOTE: checking if penalized, if the penalty expired, then set the isPenalized to false
    if (member.isPenalized) {
      if (member.penaltyUntil >= new Date()) {
        throw new ConflictException(
          `Member is penalized until ${member.penaltyUntil}`,
        );
      }
      member.isPenalized = false;
      isPenalizedMessage = 'Member is no longer penalized';
      member.penaltyUntil = null;
    }

    //NOTE: checking if member can borrow
    if (member.borrowedBooksNum >= 2) {
      throw new HttpException(
        "Member can't borrow more books",
        HttpStatus.FORBIDDEN,
      );
    }

    const book = await this.booksRepository.findOne({
      where: { code: bookCode },
      relations: ['member'],
    });

    //NOTE: checking book exists
    if (!book) {
      throw new NotFoundException(`Book with code ${bookCode} not found`);
    }

    //NOTE: checking if someone already borrowed the book
    if (book.member) {
      throw new ConflictException('Book is already borrowed by another member');
    }

    //NOTE: checking for book stock
    if (book.stock === 0) {
      throw new NotFoundException('Empty Stock');
    }

    //NOTE: algorithm for borrowing book
    member.borrowedBooksNum += 1;
    member.book.push(book);
    book.member = member;
    book.borrowedDate = new Date();
    book.isBooked = true;
    book.stock -= 1;
    await this.booksRepository.save(book);
    await this.membersRepository.save(member);

    return {
      success: true,
      message: `Book borrowed successfully ${isPenalizedMessage}`,
    };
  }

  async returnBook(returnBookDTO: transactionBookDto) {
    const { memberCode, bookCode } = returnBookDTO;
    const member = await this.membersRepository.findOne({
      where: { code: memberCode },
      relations: ['book'],
    });

    //NOTE: checking if member exists
    if (!member)
      throw new NotFoundException(`Member with code ${memberCode} Not Found`);

    const book = await this.booksRepository.findOne({
      where: { code: bookCode },
      relations: ['member'],
    });

    //NOTE: checking if book exists
    if (!book) {
      throw new NotFoundException(`Book not with code ${memberCode} found`);
    }
    //NOTE: checking if the correct member borrowed the book
    if (book.member.id !== member.id) {
      throw new ConflictException('This book was not borrowed by this member');
    }

    //NOTE: checking if the book returned late
    const borrowDuration =
      (new Date().getTime() - book.borrowedDate.getTime()) / (1000 * 3600 * 24);
    if (borrowDuration > 7) {
      member.isPenalized = true;
      member.penaltyUntil = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    }

    //NOTE: algorithm for returning book
    member.borrowedBooksNum -= 1;
    member.book = member.book.filter((b) => b.code !== book.code);
    book.member = null;
    book.borrowedDate = null;
    book.isBooked = false;
    book.stock += 1;

    await this.booksRepository.save(book);
    await this.membersRepository.save(member);

    if (member.isPenalized)
      return {
        success: true,
        message: `Book returned successfully but member is penalized until ${member.penaltyUntil}`,
      };

    return { success: true, message: 'Book returned successfully' };
  }
}
