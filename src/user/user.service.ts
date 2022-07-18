import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'src/interfaces/user.interface';
import validateEmail from 'src/middleware/email.checker';
import { Account, RegisterDto } from './dto/user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>
    ) {}

    public async create(credentials: RegisterDto): Promise<User> {

        if (this.findOnebyEmail(credentials.email))
            throw new Error('user with current email aleready exist');

        if (this.findOnebyUserName(credentials.username))
            throw new Error('user with current username aleready exist');

        if (!validateEmail(credentials.email))
            throw new Error('invalid password'); // Bind Exception for mongo Error

        const newUser = new this.userModel(RegisterDto);

        try {
            await newUser.save();
        } catch (err) {

            throw new Error('error while Saving');
        }

        return newUser;
    }

    public async delete(account: Account): Promise<Account> | null {

        const user = await this.userModel.findOneAndDelete(account).exec();

        if (user) return new Account(user);

        return null
    }

    public async update(account: Account, data: Partial<Account>): Promise<Account> {

        const user = await this.userModel.findOneAndUpdate(account, data).exec();

        try {

            await user.save();
        } catch(error) {

            throw new Error(error);
        }

        return new Account(user);
    }

    public async updatePassword(account: Account, oldPass: string, newPass: string) {

        // check if diff of past password, check pass validity ?
        const user = await this.update(account, { password: newPass });

        if (!user) return null;

        return new Account(user);
    }

    public async findOnebyEmail(
        email: string,
    ): Promise<Account> | null{

        const user: User = await this.userModel.findOne({ email: email }).exec();
        if (user) return new Account(user);

        else return null;
    }

    public async findOnebyUserName(
        username: string,
    ): Promise<Account> | null {

        const user: User = await this.userModel.findOne({ username: username }).exec();

        if (user) return new Account(user);
        return null
    }

    public async findOne(account: Account): Promise<Account> | null {

        const user: User = await this.userModel.findOne(account).exec();

        if (user) return account
    }

    public async getUsers(): Promise<Account[]> | null {

        const userList: User[] = await this.userModel.find({}).exec();


        if (userList) {

            return userList.flatMap((item) => {

                return [new Account(item)];
            });
        }

        else return null;
    }
}
