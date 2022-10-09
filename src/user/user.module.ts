import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from 'src/schema/user.schema';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { AuthModule } from 'src/auth/auth.module';
import { RedisModule } from 'src/cache/redis/redis.module';

@Module({
    imports: [
        MongooseModule.forFeature([
      	    {
       	        name: 'User',
        	    schema: UserSchema
      	    }
    	]),
        
        RedisModule,
        forwardRef(() => AuthModule),
    ],

    providers: [UserService, JwtStrategy],
    controllers: [UserController],
    exports: [UserService],
})

export class UserModule {}
