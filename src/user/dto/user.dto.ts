import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';

import { User } from 'src/interfaces/user.interface';

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

export class Account implements Partial<User> {

    username: string;
    email: string;
    createdAt: Date;
    personalInfo: object;

    @Exclude()
    password: string;

    constructor(partial: Partial<Account>) {
        Object.assign(this, partial);
    }
}
