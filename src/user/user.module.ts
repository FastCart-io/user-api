import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from 'src/schema/user.schema';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
    imports: [
        MongooseModule.forFeature([
      	    {
       	        name: 'User',
        	    schema: UserSchema
      	    }
    	]),
    ],

    providers: [UserService, JwtStrategy],
    controllers: [UserController],
    exports: [UserService],
})

export class UserModule {}
