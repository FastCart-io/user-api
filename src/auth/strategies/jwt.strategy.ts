import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { UserService } from "src/user/user.service";
import { FullJwtPayload } from "src/interfaces/payload.interface";

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {
        super({

            secretOrKey: configService.get<string>('JWT_SECRET'),
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    public async validate(payload: FullJwtPayload) {

        const account = await this.userService.findOnebyUserName(payload.username)
        //console.log(payload);

        if (!account)
            throw new UnauthorizedException('Invalid JWT subject')

        return account
    }
}

export {
    JwtStrategy
}