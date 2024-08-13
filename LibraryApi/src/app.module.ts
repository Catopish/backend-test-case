import { Module } from '@nestjs/common';
import { MembersModule } from './members/members.module';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    MembersModule,
    BooksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'Tech-Test',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
