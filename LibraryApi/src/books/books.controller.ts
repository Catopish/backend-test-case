import { Body, Controller, Get, Post } from '@nestjs/common';
import { BooksService } from './books.service';
import { postBookDto } from './dto/postBook.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { transactionBookDto } from './dto/transactionBook.dto';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private BooksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Add a book' })
  postBooks(@Body() postBookDTO: postBookDto) {
    return this.BooksService.postBook(postBookDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Get all books thats not borrowed' })
  getBooks() {
    return this.BooksService.getBooks();
  }

  @Post('/borrow')
  @ApiOperation({ summary: 'Borrow Book' })
  borrowBook(@Body() borrowBookDTO: transactionBookDto) {
    return this.BooksService.borrowBook(borrowBookDTO);
  }

  @Post('/return')
  @ApiOperation({ summary: 'Return Book' })
  returnBook(@Body() returnBookDTO: transactionBookDto) {
    return this.BooksService.returnBook(returnBookDTO);
  }
}
