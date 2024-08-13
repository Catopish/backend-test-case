import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Member } from './member.entity';
import { postMemberDto } from './dto/postMember.dto';

@Injectable()
export class MembersRepository extends Repository<Member> {
  constructor(private datasource: DataSource) {
    super(Member, datasource.createEntityManager());
  }

  async postMember(postMemberDTO: postMemberDto): Promise<Member> {
    const { code, name } = postMemberDTO;

    const member = this.create({
      code,
      name,
    });

    await this.save(member);
    return member;
  }

  async getMembers(): Promise<Member[]> {
    const query = this.createQueryBuilder('member');
    const books = await query.getMany();
    return books;
  }
}
