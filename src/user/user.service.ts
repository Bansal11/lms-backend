import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './user.schema';
import {FormattedResponse} from '../interfaces/response.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string, role: string): Promise<FormattedResponse> {
    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      username,
      role,
      password: hashedPassword,
    });

    let newUserDetails = await newUser.save();

    if (!newUserDetails) {
      throw new BadRequestException('User registration failed');
    }

    return {
        status: 'success',
        message: 'User registered successfully',
        data: newUserDetails,
    };

  }

  async validateUser(username: string, password: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(username: string, password: string): Promise<FormattedResponse> {
    const user = await this.validateUser(username, password);

    const payload = { username: user.username, sub: user._id, role: user.role };
    return {
        status: 'success',
        message: 'User logged in successfully',
        data: {
            token: this.jwtService.sign(payload),
        },
    }
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }
}
