import { ApiProperty, PartialType } from "@nestjs/swagger";

import { Account } from './user.dto';
class ReqUpdatePassDto {
    @ApiProperty({
        type: String,
        description: 'Password',
        required: true,
        example: 'verystrongpassword',
    })
    password: string;

    @ApiProperty({
        type: String,
        description: 'new different passwoed',
        required: true,
        example: 'newverystrongpassword',
    })
    newPassword: string;
}

class ReqUpdateUserDto {
    @ApiProperty({
        type: PartialType<Account>,
        description: 'user update',
        required: true,
        example: {
            username: 'user'
        }
    })
    data: Partial<Account>
}

export {

    ReqUpdatePassDto,
    ReqUpdateUserDto
}