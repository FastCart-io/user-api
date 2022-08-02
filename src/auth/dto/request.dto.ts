import { ApiProperty } from '@nestjs/swagger';

import { LoginDto, RegisterDto } from "src/user/dto/user.dto";
import { DataPayload, AccessPayload } from 'src/interfaces/payload.interface'

class RegisterReqDto extends RegisterDto {};
class LoginReqDto extends LoginDto {};
class PayloadDto {

     @ApiProperty({
        type: String,
        description: 'Username',
        required: true,
        example: 'test',
    })
    username: string;

     @ApiProperty({
        type: String,
        description: 'Jwt token to get data of user (work on trust hehe)',
        required: true,
        example: 'simple-jwt-token-in-sha256',
    })
    token: string;
    
     @ApiProperty({
        type: String,
        description: 'refresh token to regenerate new jwt token',
        required: true,
        example: 'simple-refresh-token-in-hex',
    })
    refresh: string;
};

export {

    RegisterReqDto,
    LoginReqDto,
    PayloadDto
}
