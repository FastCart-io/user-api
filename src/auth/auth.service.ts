import * as crypto from 'node:crypto';

import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'

import { UserService } from 'src/user/user.service';
import { Account, LoginDto } from 'src/user/dto/user.dto';
import { AccessPayload, DataPayload } from 'src/interfaces/payload.interface';
import { refreshData } from 'src/types/refresh.type';
import { decryptObject, encryptObject } from 'src/utils/encryption.tools';
import { IUser } from 'src/interfaces/user.interface';
import validateEmail from 'src/middleware/email.checker';
import { LocalCredentialService } from './services/local-credential.service';

import * as CacheService from 'cache-manager-redis-store';
import { threadId } from 'node:worker_threads';
import { RedisService } from 'src/cache/redis/redis.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly localCredential: LocalCredentialService,
        private cacheService: RedisService,
    ) {}

    public async login(loginDto: LoginDto): Promise<DataPayload> | null {
        
        const cachedData = await this.cacheService.get(loginDto.credential.toString());
        if (cachedData) {
            
            return await this.generateJwt(cachedData);
        }

        let user: Partial<Account> | null = validateEmail(loginDto.credential) ?
            await this.userService.findOnebyEmail(loginDto.credential) :
            await this.userService.findOnebyUserName(loginDto.credential);

        if (!user) return null
        const account = await this.localCredential.validate({

            identifier: loginDto.credential,
            password: loginDto.password
        });
    
        const { username, password, createdAt, personalInfo } = account;
        if(!account) return null;

        const acc = new Account({

            username: username,
            password: password,
            createdAt: createdAt,
            personalInfo: personalInfo
        });

        await this.cacheService.setObject(user.username, acc); // seed with id ??
        return await this.generateJwt(acc);
    }

    public async validatePayload(payload: AccessPayload): Promise<Partial<IUser> | null> {
        
        return await this.userService.findOnebyUserName(payload.username);
    }
    
    // refreshData[token] field need ha more explicit name
    public async generateJwt(account: Partial<Account>) {

        const payload: AccessPayload = {

            sub: '0',
            username: account.username,
            email: account.email,
            expiration: process.env.JWT_EXPIRES
        }
        
        const refreshToken: refreshData = await this.generateRefreshToken({
            username: account.username,
            token: 'jwt'
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
            token: data.token,
            refresh: Buffer.from(crypto.randomBytes(16)).toString('hex')
        }
    }

    public async validateRefreshToken(token: string): Promise<DataPayload> {

        const data: refreshData = decryptObject(token);
        const user = await this.userService.findOnebyUserName(data.username);
        if (!user) return null;

        const jwtToken = await this.generateJwt(user);

        return jwtToken;
    }
}

