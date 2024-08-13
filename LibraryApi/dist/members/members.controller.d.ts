import { MembersService } from './members.service';
import { postMemberDto } from './dto/postMember.dto';
export declare class MembersController {
    private MembersService;
    constructor(MembersService: MembersService);
    postMember(postMemberDTO: postMemberDto): Promise<import("./member.entity").Member>;
    getMembers(): Promise<import("./member.entity").Member[]>;
}
