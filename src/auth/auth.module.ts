import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import configuration from 'src/config/configuration';
import { Jwt_s } from 'src/interfaces/jwt.interface';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    providers: [AuthService],
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
        }),

        PassportModule.registerAsync({
            useFactory: async (configService: ConfigService) => {

                const jwtConfig = configService.get<Jwt_s>('jwt');
                return {
                    secret: jwtConfig.secret,
                    signOptions: { expiresIn: jwtConfig.expiresIn }
                }
            },

            inject: [ConfigService]
        }),

        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => {

                const jwtConfig = configService.get<Jwt_s>('jwt');
                return {
                    secret: jwtConfig.secret,
                    signOptions: { expiresIn: jwtConfig.expiresIn }
                }
            },

            inject: [ConfigService]
        }),

        UserModule,
    ],
    exports: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}
