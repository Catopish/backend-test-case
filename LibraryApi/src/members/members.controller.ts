import { Body, Controller, Get, Post } from '@nestjs/common';
import { MembersService } from './members.service';
import { postMemberDto } from './dto/postMember.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Members')
@Controller('members')
export class MembersController {
  constructor(private MembersService: MembersService) {}

  @Post()
  postMember(@Body() postMemberDTO: postMemberDto) {
    return this.MembersService.postMember(postMemberDTO);
  }

  @Get()
  getMembers() {
    return this.MembersService.getMembers();
  }
}
