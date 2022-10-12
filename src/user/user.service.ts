import {
    Injectable,
    UseInterceptors,
    ClassSerializerInterceptor,
    Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'src/interfaces/user.interface';
import validateEmail from 'src/middleware/email.checker';
import { Account, RegisterDto } from './dto/user.dto';
import { LocalCredentialService } from 'src/auth/services/local-credential.service';
import { RedisService } from 'src/cache/redis/redis.service';

@Injectable()
export class UserService {

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly localCredService: LocalCredentialService,
        private cacheService: RedisService,
    ) {}

    @UseInterceptors(ClassSerializerInterceptor)
    public async create(credentials: RegisterDto): Promise<Account | null> {

        if (
            await this.findOnebyEmail(credentials.email) || 
            await this.findOnebyUserName(credentials.username)
        ) return null;

        if (!validateEmail(credentials.email)) return null;

        const newUser = new this.userModel(credentials);
        try {
            await newUser.save();
        } catch (err) {
            return null;
        }

        const { username, password, email } = newUser;
        const acc = new Account({
            username: username,
            email: email,
            password: password,
        });

        this.cacheService.setObject(acc.username, acc);
        return acc;
    }

    public async delete(account: Account): Promise<Partial<Account>> | null {
        
        const user = await this.userModel.findOneAndDelete(account).exec();

        if (user) return new Account(user);

        return null;
    }

    public async update(
        account: Account,
        data: Partial<Account>,
    ): Promise<Partial<Account>> {
        const user = await this.userModel
            .findOneAndUpdate(account, data)
            .exec();

        try {
            (user);
            await user.save();
        } catch (error) {
            throw new Error(error);
        }

        return new Account(user);
    }

    public async updatePassword(
        account: Account,
        oldPass: string,
        newPass: string,
    ) {

        try {
            const user = await this.localCredService.findOne(account.username);
            if (!user) return null;
            
            if (await user.updatePassword(oldPass, newPass) != true)
                return null;

            const { username, email, createdAt, personalInfo, password } = user;

            return new Account({
                username: username,
                email: email,
                createdAt: createdAt,
                personalInfo: personalInfo,
                password: password,
            });
        } catch (err) {
            return null;
        }
    }

    public async findOnebyEmail(
        email: string,
    ): Promise<Partial<Account>> | null {
        
        const cached = await this.cacheService.get(email) as Partial<Account>;
        if (cached) return cached;

        const user: User = await this.userModel
            .findOne({ email: email })
            .exec();
        if (user) {

            const acc = new Account(user);
            this.cacheService.setObject(user.email, acc);
            return acc;
        }
        
        return null;
    }

    public async findOnebyUserName(
        username: string,
    ): Promise<Partial<Account>> | null {

        const cached = await this.cacheService.get(username) as Partial<Account>;
        if (cached) return cached;

        const user: User = await this.userModel
            .findOne({ username: username })
            .exec();
        if (!user) return null;
        
        const acc = new Account(user);
        this.cacheService.setObject(acc.username, acc);
        
        return acc;
    }

    public async findOne(account: Account): Promise<Partial<Account>> | null {
        
        const user: User = await this.userModel.findOne(account).exec();
        if (user) return new Account(account);

        return null;
    }

    public async getUsers(): Promise<Account[]> | null {
        const userList: User[] = await this.userModel.find({}).exec();

        if (userList) {
            return userList.flatMap((item) => {
                return [new Account(item)];
            });
        } else return null;
    }
}
