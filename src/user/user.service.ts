import { 
    Injectable,
    UseInterceptors, 
    ClassSerializerInterceptor 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IUser, User } from 'src/interfaces/user.interface';
import validateEmail from 'src/middleware/email.checker';
import { Account, RegisterDto } from './dto/user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>
    ) {}


    @UseInterceptors(ClassSerializerInterceptor)
    public async create(credentials: RegisterDto): Promise<Account | null> {

        if(await this.findOnebyEmail(credentials.email))
            return null

        if(await this.findOnebyUserName(credentials.username))
            return null

        if (!validateEmail(credentials.email))
            return null;

            const newUser = new this.userModel(credentials);
        try {

            await newUser.save();
        } catch (err) {

            return null
        }

        const { username, password, email } = newUser;

        return new Account({
            username: username,
            email: email,
            password: password,
        });

    }

    public async delete(account: Account): Promise<Partial<Account>> | null {

        const user = await this.userModel.findOneAndDelete(account).exec();

        if (user) return new Account(user);

        return null
    }

    public async update(account: Account, data: Partial<Account>): Promise<Partial<Account>> {

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
    ): Promise<Partial<Account>> | null{

        const user: User = await this.userModel.findOne({ email: email }).exec();
        if (user) return new Account(user);

        else return null;
    }

    public async findOnebyUserName(
        username: string,
    ): Promise<Partial<Account>> | null {

        const user: User = await this.userModel.findOne({ username: username }).exec();
        if (!user) return null
        return user
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
        }

        else return null;
    }
}
