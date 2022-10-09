import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { User } from "src/interfaces/user.interface";
import validateEmail from "src/middleware/email.checker";
import { Account } from "src/user/dto/user.dto";

interface Credentials {

    identifier: string,
    password: string,
}

@Injectable()
class LocalCredentialService {

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>
    ) {}

    public async findOne(credential: string):Promise<User | null> {

        const user: User = validateEmail(credential)
            ? await this.userModel.findOne({ email: credential }).exec()
            : await this.userModel.findOne({ username: credential }).exec()

        if(!user) return null;
        return user;
    }
    
    // Account isn't sent with hashed pswd
    public async validate(credentials: Credentials): Promise<Partial<Account> | null> {

        const {
            identifier,
            password
        } = credentials;

        const user = await this.findOne(identifier);

        if(!await user.validatePassword(password))
            return null

        const {
            username,
            email,
            createdAt,
            personalInfo,
        } = user;

        return new Account({
            username: username,
            email: email,
            password: password,
            createdAt: createdAt,
            personalInfo: personalInfo
        });
    }
}

export {
    LocalCredentialService
}
