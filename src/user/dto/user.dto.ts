import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {

    @ApiProperty({
        type: String,
        description: 'Username',
        required: true,
        example: 'test'
    })
    username: string;

    @ApiProperty({
        type: String,
        description: 'Password',
        required: true,
        example: 'verystrongpassword'
    })
    password: string;

    @ApiProperty({
        type: String,
        description: 'Email',
        required: true,
        example: 'user@test.test',
    })
    email: string;
}
