import {
	Body,
	ClassSerializerInterceptor,
	Controller, 
	HttpCode, 
	Patch, 
	Post, 
	CacheInterceptor,
	CacheKey,
	CacheTTL,
	UseInterceptors, 
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { Account } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginReqDto, PayloadDto, RegisterReqDto } from './dto/request.dto';

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
	
	@UseInterceptors(CacheInterceptor)
	@CacheTTL(60)
	@CacheKey('user-me')
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

	@Patch('refreshToken')
	@HttpCode(200)
	@ApiBadRequestResponse({ description: 'cannot perform refresh' })
	public async askrefreshToken(@Body() body: PayloadDto) {

		console.log(body)
		const data = await this.authService.validateRefreshToken(body.refresh)
		if (!data)
			return { status: 'error bad refresh token'}

		return {
			status: 'sucess',
			token: data
		};
	}
}
