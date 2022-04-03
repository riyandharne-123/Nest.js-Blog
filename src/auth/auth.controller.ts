/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthService } from './auth.service';

import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
   @Post('/register')
    async register(@Body() userRegisterDto: UserRegisterDto): Promise<any> {
        return this.authService.register(userRegisterDto);
    }

    @Post('/login')
    async login(@Body() userLoginDto: UserLoginDto): Promise<any> {
        return this.authService.login(userLoginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/user')
    async user(@Request() req): Promise<any> {
        return req.user
    }
}