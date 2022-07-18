import { Model, Document } from "mongoose"

export interface IUser {

    username: string;
    email: string;
    createdAt: Date; // dateZ
    personalInfo: object;
};

export interface User extends IUser, Document {

    password: string;
    validatePassword(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<User> {

    validateEmail(email: string): boolean;
}

