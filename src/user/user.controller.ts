import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body('username') username: string, @Body('password') password: string, @Body('role') role: string) {
    return this.userService.register(username, password, role);
  }

  @Post('login')
  async login(@Body('username') username: string, @Body('password') password: string) {
    return this.userService.login(username, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    return req.user;
  }
}
