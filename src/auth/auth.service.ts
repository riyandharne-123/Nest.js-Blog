/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ){}

    async register(userRegisterDto: UserRegisterDto): Promise<any> {
        const response = await this.userRepository.register(userRegisterDto)
        const accessToken = await this.jwtService.sign({ response });
        response['token'] = accessToken

        return response
    }

    async login(userLoginDto: UserLoginDto): Promise<any> {
        const response = await this.userRepository.login(userLoginDto)
        const accessToken = await this.jwtService.sign({ response });
        response['token'] = accessToken

        return response
    }
}