import { Body, ClassSerializerInterceptor, Controller, HttpCode, Post, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { Account, RegisterDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginReqDto, RegisterReqDto } from './dto/request.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

	constructor(
		private userService: UserService,
		private authService: AuthService,
	) {}

	@Post('login')
	@HttpCode(200)
	@ApiBadRequestResponse({ description: 'Unable to login' })
	public async login(@Body() loginReqDto: LoginReqDto): Promise<any> {

		return this.authService.login(loginReqDto)
	}

	@Post('register')
	@HttpCode(200)
	@ApiBadRequestResponse({ description: 'User Already exist' })
	@UseInterceptors(ClassSerializerInterceptor)
	public async register(@Body() registerDto: RegisterReqDto) {

		const account: Account = await this.userService.create(registerDto);
		if (!account) return;
		return await this.authService.generateJwt(account);
	}
}
