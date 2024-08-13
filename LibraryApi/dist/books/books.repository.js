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
exports.BooksRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const book_entity_1 = require("./book.entity");
let BooksRepository = class BooksRepository extends typeorm_1.Repository {
    constructor(datasource) {
        super(book_entity_1.Book, datasource.createEntityManager());
        this.datasource = datasource;
    }
    async postBook(postBookDTO) {
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
    async getBooks() {
        const query = this.createQueryBuilder('book');
        query.where({ isBooked: false });
        const books = await query.getMany();
        return books;
    }
};
exports.BooksRepository = BooksRepository;
exports.BooksRepository = BooksRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], BooksRepository);
//# sourceMappingURL=books.repository.js.map