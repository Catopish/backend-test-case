import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { MembersRepository } from './members.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  providers: [MembersService, MembersRepository],
  controllers: [MembersController],
  exports: [MembersRepository],
})
export class MembersModule {}
