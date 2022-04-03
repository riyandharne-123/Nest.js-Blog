/* eslint-disable prettier/prettier */
import { Repository, EntityRepository } from "typeorm";
import * as bcrypt from 'bcrypt';

import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from "./dto/user-login.dto";
import { User } from "./user.entity";

import { ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async register(userRegisterDto: UserRegisterDto): Promise<any> {
        const user = new User();
        user.email = userRegisterDto.email;
        user.name = userRegisterDto.name;
        user.password = await bcrypt.hash(userRegisterDto.password, 10);

        try {
            return await user.save();
        } catch (error) {
              if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('User with this email already exists.');
              } else {
                throw new InternalServerErrorException();
              }
        }
    }

    async login(userLoginDto: UserLoginDto): Promise<any> {
        const user = await this.findOne({ email: userLoginDto.email });

        if(!user) {
            throw new UnauthorizedException('User does not exist.');
        }

        const password = await bcrypt.compare(userLoginDto.password, user.password);

        if(!password) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        return user;
    }
}