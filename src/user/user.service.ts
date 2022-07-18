import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'src/interfaces/user.interface';
import validateEmail from 'src/middleware/email.checker';
import { RegisterDto } from './dto/user.dto';

type credentialType = 'username' | 'email' | 'id';

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

    public async delete() { throw new Error('not Implemented'); }

    public async update() { throw new Error('not Implemented'); }

    public async findOnebyEmail(
        email: string,
    ): Promise<User> | null{

        const user: User = await this.userModel.findOne({ email: email }).exec();
        if (user) return user;

        else return null;
    }

    public async findOnebyUserName(
        username: string,
    ): Promise<User> | null {

        const user: User = await this.userModel.findOne({ username: username }).exec();
        if (user) return user;

        return null
    }

    public async getUsers(): Promise<User[]> | null {

        const userList: User[] = await this.userModel.find({}).exec();
        if (userList) return userList;

        else return null;
    }
}
