import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from '../auth/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { username, password, nickname, bio } = registerDto;

    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      username,
      password: hashedPassword,
      nickname,
      bio,
    });

    return user.save();
  }

  async findOne(username: string): Promise<UserDocument | undefined> {
    return this.userModel.findOne({ username }).exec();
  }

  async findOneById(userId: string): Promise<UserDocument | undefined> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async isNicknameTaken(
    nickname: string,
    currentUserId: string,
  ): Promise<boolean> {
    const user = await this.userModel.findOne({ nickname }).exec();
    return user && user._id.toString() !== currentUserId;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.nickname) {
      const isTaken = await this.isNicknameTaken(
        updateUserDto.nickname,
        userId,
      );
      if (isTaken) {
        throw new BadRequestException('Nickname already taken');
      }
      user.nickname = updateUserDto.nickname;
    }

    if (updateUserDto.bio) {
      user.bio = updateUserDto.bio;
    }

    return user.save();
  }
}
