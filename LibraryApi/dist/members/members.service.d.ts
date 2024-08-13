import { MembersRepository } from './members.repository';
import { postMemberDto } from './dto/postMember.dto';
export declare class MembersService {
    private MembersRepository;
    constructor(MembersRepository: MembersRepository);
    postMember(postMemberDTO: postMemberDto): Promise<import("./member.entity").Member>;
    getMembers(): Promise<import("./member.entity").Member[]>;
}
