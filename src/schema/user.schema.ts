import * as Bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';

import { IUserModel, User } from 'src/interfaces/user.interface';
import { Jwt_s } from 'src/interfaces/jwt.interface';
import validateEmail from 'src/middleware/email.checker';

export const UserSchema: Schema = new Schema({

    username: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String,
    },
    personalInfo: {
        type: Schema.Types.ObjectId
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

UserSchema.statics.validateEmail = (email: string) => (validateEmail(email));

UserSchema.methods.validatePassword = function(password: string): Promise<Boolean> {

    const user = this;

    return new Promise((resolve, reject) => {

        try {

            const isMatching = Bcrypt.compareSync(password, user.password);
            resolve(isMatching);
        } catch(err) {

            reject(err);
            throw new Error(err);
        }
    });
}

UserSchema.pre<User>('save', function(next) {

    const user = this;

    if (!user.isModified('password'))
        return next();

    try {

        const salt = Bcrypt.genSaltSync(10, 'b');
        const hash = Bcrypt.hashSync(user.password, salt);

        user.password = hash;
        next();
    } catch(err) {

        throw new Error(err);
    }
});

export const UserModel: IUserModel = model<User, IUserModel>('User', UserSchema);