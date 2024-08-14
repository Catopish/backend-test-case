"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksService = void 0;
const common_1 = require("@nestjs/common");
const books_repository_1 = require("./books.repository");
const members_repository_1 = require("../members/members.repository");
let BooksService = class BooksService {
    constructor(booksRepository, membersRepository) {
        this.booksRepository = booksRepository;
        this.membersRepository = membersRepository;
    }
    postBook(postBookDTO) {
        return this.booksRepository.postBook(postBookDTO);
    }
    async getBooks() {
        return this.booksRepository.getBooks();
    }
    async borrowBook(borrowBookDTO) {
        let isPenalizedMessage = '';
        const { memberCode, bookCode } = borrowBookDTO;
        const member = await this.membersRepository.findOne({
            where: { code: memberCode },
            relations: ['book'],
        });
        if (!member)
            throw new common_1.NotFoundException('Bad Request');
        if (member.isPenalized) {
            if (member.penaltyUntil >= new Date()) {
                throw new common_1.ConflictException(`Member is penalized until ${member.penaltyUntil}`);
            }
            member.isPenalized = false;
            isPenalizedMessage = 'Member is no longer penalized';
            member.penaltyUntil = null;
        }
        if (member.borrowedBooksNum >= 2) {
            throw new common_1.HttpException("Member can't borrow more books", common_1.HttpStatus.FORBIDDEN);
        }
        const book = await this.booksRepository.findOne({
            where: { code: bookCode },
            relations: ['member'],
        });
        if (!book) {
            throw new common_1.NotFoundException(`Book with code ${bookCode} not found`);
        }
        if (book.member) {
            throw new common_1.ConflictException('Book is already borrowed by another member');
        }
        if (book.stock === 0) {
            throw new common_1.NotFoundException('Empty Stock');
        }
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
    async returnBook(returnBookDTO) {
        const { memberCode, bookCode } = returnBookDTO;
        const member = await this.membersRepository.findOne({
            where: { code: memberCode },
            relations: ['book'],
        });
        if (!member)
            throw new common_1.NotFoundException(`Member with code ${memberCode} Not Found`);
        const book = await this.booksRepository.findOne({
            where: { code: bookCode },
            relations: ['member'],
        });
        if (!book) {
            throw new common_1.NotFoundException(`Book not with code ${memberCode} found`);
        }
        if (book.member.id !== member.id) {
            throw new common_1.ConflictException('This book was not borrowed by this member');
        }
        const borrowDuration = (new Date().getTime() - book.borrowedDate.getTime()) / (1000 * 3600 * 24);
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
        if (member.isPenalized)
            return {
                success: true,
                message: `Book returned successfully but member is penalized until ${member.penaltyUntil}`,
            };
        return { success: true, message: 'Book returned successfully' };
    }
};
exports.BooksService = BooksService;
exports.BooksService = BooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [books_repository_1.BooksRepository,
        members_repository_1.MembersRepository])
], BooksService);
//# sourceMappingURL=books.service.js.map