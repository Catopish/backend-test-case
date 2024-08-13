import { DataSource, Repository } from 'typeorm';
import { Member } from './member.entity';
import { postMemberDto } from './dto/postMember.dto';
export declare class MembersRepository extends Repository<Member> {
    private datasource;
    constructor(datasource: DataSource);
    postMember(postMemberDTO: postMemberDto): Promise<Member>;
    getMembers(): Promise<Member[]>;
}
