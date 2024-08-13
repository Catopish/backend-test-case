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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksController = void 0;
const common_1 = require("@nestjs/common");
const books_service_1 = require("./books.service");
const postBook_dto_1 = require("./dto/postBook.dto");
const swagger_1 = require("@nestjs/swagger");
const transactionBook_dto_1 = require("./dto/transactionBook.dto");
let BooksController = class BooksController {
    constructor(BooksService) {
        this.BooksService = BooksService;
    }
    postBooks(postBookDTO) {
        return this.BooksService.postBook(postBookDTO);
    }
    getBooks() {
        return this.BooksService.getBooks();
    }
    borrowBook(borrowBookDTO) {
        return this.BooksService.borrowBook(borrowBookDTO);
    }
    returnBook(returnBookDTO) {
        return this.BooksService.returnBook(returnBookDTO);
    }
};
exports.BooksController = BooksController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add a book' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [postBook_dto_1.postBookDto]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "postBooks", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all books thats not borrowed' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "getBooks", null);
__decorate([
    (0, common_1.Post)('/borrow'),
    (0, swagger_1.ApiOperation)({ summary: 'Borrow Book' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transactionBook_dto_1.transactionBookDto]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "borrowBook", null);
__decorate([
    (0, common_1.Post)('/return'),
    (0, swagger_1.ApiOperation)({ summary: 'Return Book' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transactionBook_dto_1.transactionBookDto]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "returnBook", null);
exports.BooksController = BooksController = __decorate([
    (0, swagger_1.ApiTags)('Books'),
    (0, common_1.Controller)('books'),
    __metadata("design:paramtypes", [books_service_1.BooksService])
], BooksController);
//# sourceMappingURL=books.controller.js.map