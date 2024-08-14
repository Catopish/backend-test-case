import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { BooksRepository } from './books.repository';
import { MembersRepository } from 'src/members/members.repository';
import { Book } from './book.entity';
import { Member } from 'src/members/member.entity';
import {
  ConflictException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { transactionBookDto } from './dto/transactionBook.dto';

describe('BooksService', () => {
  let service: BooksService;
  let booksRepository: BooksRepository;
  let membersRepository: MembersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: BooksRepository,
          useValue: {
            postBook: jest.fn(),
            getBooks: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: MembersRepository,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    booksRepository = module.get<BooksRepository>(BooksRepository);
    membersRepository = module.get<MembersRepository>(MembersRepository);
  });

  describe('borrowBook', () => {
    it('should throw NotFoundException if member is not found', async () => {
      const borrowBookDTO: transactionBookDto = {
        memberCode: 'member1',
        bookCode: 'book1',
      };
      jest.spyOn(membersRepository, 'findOne').mockResolvedValue(null);

      await expect(service.borrowBook(borrowBookDTO)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if member is penalized', async () => {
      const member = new Member();
      member.code = 'member1';
      member.isPenalized = true;
      member.penaltyUntil = new Date(Date.now() + 1000 * 60 * 60 * 24); // Future date
      jest.spyOn(membersRepository, 'findOne').mockResolvedValue(member);

      const borrowBookDTO: transactionBookDto = {
        memberCode: 'member1',
        bookCode: 'book1',
      };

      await expect(service.borrowBook(borrowBookDTO)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw HttpException if member exceeds borrow limit', async () => {
      const member = new Member();
      member.code = 'member1';
      member.borrowedBooksNum = 2;
      jest.spyOn(membersRepository, 'findOne').mockResolvedValue(member);

      const borrowBookDTO: transactionBookDto = {
        memberCode: 'member1',
        bookCode: 'book1',
      };

      await expect(service.borrowBook(borrowBookDTO)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw NotFoundException if book is not found', async () => {
      const member = new Member();
      member.code = 'member1';
      member.borrowedBooksNum = 1;
      jest.spyOn(membersRepository, 'findOne').mockResolvedValue(member);
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(null);

      const borrowBookDTO: transactionBookDto = {
        memberCode: 'member1',
        bookCode: 'book1',
      };

      await expect(service.borrowBook(borrowBookDTO)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if book is already borrowed', async () => {
      const member = new Member();
      member.code = 'member1';
      member.borrowedBooksNum = 1;
      const book = new Book();
      book.code = 'book1';
      book.member = new Member(); // Book is borrowed by someone else
      jest.spyOn(membersRepository, 'findOne').mockResolvedValue(member);
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(book);

      const borrowBookDTO: transactionBookDto = {
        memberCode: 'member1',
        bookCode: 'book1',
      };

      await expect(service.borrowBook(borrowBookDTO)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException if book stock is zero', async () => {
      const member = new Member();
      member.code = 'member1';
      member.borrowedBooksNum = 1;
      const book = new Book();
      book.code = 'book1';
      book.stock = 0; // Stock is zero
      jest.spyOn(membersRepository, 'findOne').mockResolvedValue(member);
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(book);

      const borrowBookDTO: transactionBookDto = {
        memberCode: 'member1',
        bookCode: 'book1',
      };

      await expect(service.borrowBook(borrowBookDTO)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should successfully borrow a book', async () => {
      const member = new Member();
      member.code = 'member1';
      member.borrowedBooksNum = 1;

      const book = new Book();
      book.code = 'book1';
      book.stock = 1;
      book.isBooked = false;

      jest.spyOn(membersRepository, 'findOne').mockResolvedValue(member);
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(book);
      jest.spyOn(booksRepository, 'save').mockResolvedValue(book);
      jest.spyOn(membersRepository, 'save').mockResolvedValue(member);

      const borrowBookDTO: transactionBookDto = {
        memberCode: 'member1',
        bookCode: 'book1',
      };

      const result = await service.borrowBook(borrowBookDTO);
      expect(result).toEqual({
        success: true,
        message: 'Book borrowed successfully',
      });
      expect(book.member).toEqual(member);
      expect(book.borrowedDate).toBeInstanceOf(Date);
      expect(book.isBooked).toBe(true);
      expect(book.stock).toBe(0);
      expect(member.borrowedBooksNum).toBe(2);
    });
  });

  describe('returnBook', () => {
    it('should throw NotFoundException if member is not found', async () => {
      const returnBookDTO: transactionBookDto = {
        memberCode: 'member1',
        bookCode: 'book1',
      };
      jest.spyOn(membersRepository, 'findOne').mockResolvedValue(null);

      await expect(service.returnBook(returnBookDTO)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if book is not found', async () => {
      const member = new Member();
      member.code = 'member1';
      jest.spyOn(membersRepository, 'findOne').mockResolvedValue(member);
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(null);

      const returnBookDTO: transactionBookDto = {
        memberCode: 'member1',
        bookCode: 'book1',
      };

      await expect(service.returnBook(returnBookDTO)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if book was not borrowed by the member', async () => {
      const member = new Member();
      member.code = 'member1';
      member.id = 1;
      const book = new Book();
      book.code = 'book1';
      book.member = new Member(); // Book was borrowed by someone else
      jest.spyOn(membersRepository, 'findOne').mockResolvedValue(member);
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(book);

      const returnBookDTO: transactionBookDto = {
        memberCode: 'member1',
        bookCode: 'book1',
      };

      await expect(service.returnBook(returnBookDTO)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should handle late return and apply penalty', async () => {
      const member = new Member();
      member.code = 'member1';
      member.id = 1;
      member.borrowedBooksNum = 1;

      const book = new Book();
      book.code = 'book1';
      book.member = member;
      book.borrowedDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 8); // 8 days ago
      jest.spyOn(membersRepository, 'findOne').mockResolvedValue(member);
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(book);
      jest.spyOn(booksRepository, 'save').mockResolvedValue(book);
      jest.spyOn(membersRepository, 'save').mockResolvedValue(member);

      const returnBookDTO: transactionBookDto = {
        memberCode: 'member1',
        bookCode: 'book1',
      };

      const result = await service.returnBook(returnBookDTO);
      expect(result).toEqual({
        success: true,
        message: 'Book returned successfully',
      });
      expect(member.isPenalized).toBe(true);
      expect(member.penaltyUntil).toBeInstanceOf(Date);
      expect(book.member).toBeNull();
      expect(book.borrowedDate).toBeNull();
      expect(book.isBooked).toBe(false);
      expect(book.stock).toBe(1);
      expect(member.borrowedBooksNum).toBe(0);
    });
  });
});
