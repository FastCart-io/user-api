import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import configuration from 'src/config/configuration';
import { Jwt_s } from 'src/interfaces/jwt.interface';
import { UserSchema } from 'src/schema/user.schema';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalCredentialService } from './services/local-credential.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    providers: [AuthService, LocalCredentialService, JwtStrategy],

    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
        }),

        PassportModule,

        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => {
                const jwtConfig = configService.get<Jwt_s>('jwt');
                return {
                    secret: jwtConfig.secret,
                    signOptions: { expiresIn: jwtConfig.expiresIn },
                };
            },

            inject: [ConfigService],
        }),

        MongooseModule.forFeature([
            {
                name: 'User',
                schema: UserSchema,
            },
        ]),

        forwardRef(() => UserModule),
    ],
    exports: [AuthService, LocalCredentialService],
    controllers: [AuthController],
})
export class AuthModule {}
