import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Request,
    UseGuards
} from '@nestjs/common';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { UserService } from './user.service';
import { LocalGuard } from 'src/guard/local.guard';
import { Account } from './dto/user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  public async getUser(@Request() req): Promise<any> {
    return {
      status: 'sucess',
      data: {
        user: req.user,
      },
    };
  }

  @Delete('/me')
  @UseGuards(LocalGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized', status: 404 })
  public async deleteUser(@Request() request): Promise<any> {
    await this.userService.delete(request.user);

    return { status: 'success' };
  }

  @Patch('/me')
  public async updateUser(@Request() req, @Body() body: any): Promise<any> {
    const updatedAcc = await this.userService.update(req.user, body);

    return {
      status: 'success',
      data: {
        updatedAcc,
      },
    };
  }

  @Patch('/me/password')
  public async updatePassword(@Request() req, @Body() body: any) {
    const { pass, oldPass } = body;

    await this.userService.updatePassword(req.user, oldPass, pass);

    return { status: 'success' };
  }
}
