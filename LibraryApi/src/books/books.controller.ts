import { Body, Controller, Get, Post } from '@nestjs/common';
import { BooksService } from './books.service';
import { postBookDto } from './dto/postBook.dto';
import { ApiTags } from '@nestjs/swagger';
import { transactionBookDto } from './dto/transactionBook.dto';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private BooksService: BooksService) {}

  @Post()
  postBooks(@Body() postBookDTO: postBookDto) {
    return this.BooksService.postBook(postBookDTO);
  }

  @Get()
  getBooks() {
    return this.BooksService.getBooks();
  }

  @Post('/borrow')
  borrowBook(@Body() borrowBookDTO: transactionBookDto) {
    return this.BooksService.borrowBook(borrowBookDTO);
  }

  @Post('/return')
  returnBook(@Body() returnBookDTO: transactionBookDto) {
    return this.BooksService.returnBook(returnBookDTO);
  }
}
