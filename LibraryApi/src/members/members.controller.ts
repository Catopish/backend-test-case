import { Body, Controller, Get, Post } from '@nestjs/common';
import { MembersService } from './members.service';
import { postMemberDto } from './dto/postMember.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Members')
@Controller('members')
export class MembersController {
  constructor(private MembersService: MembersService) {}

  @Post()
  @ApiOperation({ summary: 'Add a member' })
  postMember(@Body() postMemberDTO: postMemberDto) {
    return this.MembersService.postMember(postMemberDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Get all member' })
  getMembers() {
    return this.MembersService.getMembers();
  }
}
