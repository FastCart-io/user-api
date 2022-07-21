import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    Patch,
    Request,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { ReqUpdatePassDto, ReqUpdateUserDto } from './dto/request.dto';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth()
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get('/me')
    @UseGuards(JwtGuard)
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    public async getUser(@Request() req): Promise<any> {

        return {
            status: 'sucess',
            data: {
                user: req.user,
            },
        };
    }

    @Delete('/me')
    //@UseGuards(LocalGuard)
    @ApiUnauthorizedResponse({ description: 'Unauthorized', status: 404 })
    public async deleteUser(@Request() request): Promise<any> {

        if (!await this.userService.delete(request.user))
            throw new HttpException('user nof found', 400);

        return { status: 'success' };
    }

    @Patch('/me')
    @UseGuards(JwtGuard)
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    public async updateUser(@Request() req, @Body() body: ReqUpdateUserDto): Promise<any> {

        const updatedAcc = await this.userService.update(req.user, body.data);
        if (!updatedAcc) throw new HttpException('user not found', 400);

        return {
            status: 'success',
            data: {
                updatedAcc,
            },
        };
    }

    @Patch('/me/password')
    @UseGuards(JwtGuard)
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    public async updatePassword(@Request() req, @Body() body: ReqUpdatePassDto) {

        const { password, newPassword } = body;
        const account = await this.userService.updatePassword(req.user, password, newPassword);

        if (!account) throw new HttpException('user not found', 400);
        return { status: 'success' };
    }
}
