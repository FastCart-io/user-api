import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'

import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}
}
