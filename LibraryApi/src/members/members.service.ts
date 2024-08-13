import { Injectable } from '@nestjs/common';
import { MembersRepository } from './members.repository';
import { postMemberDto } from './dto/postMember.dto';

@Injectable()
export class MembersService {
  constructor(private MembersRepository: MembersRepository) {}

  postMember(postMemberDTO: postMemberDto) {
    return this.MembersRepository.postMember(postMemberDTO);
  }

  getMembers() {
    return this.MembersRepository.getMembers();
  }
}
