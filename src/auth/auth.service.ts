import * as crypto from 'node:crypto';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'

import { UserService } from 'src/user/user.service';
import { Account } from 'src/user/dto/user.dto';
import { AccessPayload, DataPayload } from 'src/interfaces/payload.interface';
import { refreshData } from 'src/types/refresh.type';
import { encryptObject } from 'src/utils/encryption.tools';
import { IUser } from 'src/interfaces/user.interface';
import validateEmail from 'src/middleware/email.checker';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    public async login(loginDto: any): Promise<DataPayload> {

        let user: Account | null = validateEmail(loginDto.credential) ?
            await this.userService.findOnebyEmail(loginDto.credential) :
            await this.userService.findOnebyUserName(loginDto.credential);

        if (!user) throw new Error('user not found');

        // localCredential to check userData;

        return await this.generateJwt(user);
    }

    public async validatePayload(payload: AccessPayload): Promise<IUser | null> {

        return await this.userService.findOnebyUserName(payload.username);
    }

    public async generateJwt(account: Partial<Account>) {

        const payload: AccessPayload = {

            sub: '0',
            username: account.username,
            email: account.email,
            expiration: process.env.JWT_EXPIRES
        }

        const refreshToken: refreshData = await this.generateRefreshToken({
            username: account.username
        });

        const dataPaylaod: DataPayload = {

            data: payload,
            token: this.jwtService.sign(payload),
            refresh: encryptObject(refreshToken)
        };

        return dataPaylaod;
    }

    public async generateRefreshToken(data: Partial<refreshData>): Promise<refreshData> {

        return {

            username: data.username,
            token: 'jwt',
            refresh: Buffer.from(crypto.randomBytes(16)).toString('hex')
        }
    }
}
