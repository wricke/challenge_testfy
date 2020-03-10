import { HttpStatus, Body, ConflictException } from '@nestjs/common';

import { ResponseDto } from 'src/common/interfaces/response.dto';

import { UsersService } from './users.service';
import { Post, Controller } from 'src/common/helpers/controller.helper';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserMessages } from './enums/messages.enum';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ){}

  @Post(
    'register',
    false,
    {
      status: HttpStatus.CREATED,
      description: UserMessages.REGISTERED,
    },
    {
      status: HttpStatus.CONFLICT,
      description: UserMessages.DUPLICATED,
    }
  )
  async createUser(@Body() data: CreateUserDto): Promise<ResponseDto> {
    try {
      const user = await this.usersService.create(data);

      return new ResponseDto(true, user, UserMessages.REGISTERED);
    } catch (error) {
      switch(error.code) {
      case 11000:
        throw new ConflictException(new ResponseDto(false, null, UserMessages.DUPLICATED));
      default:
        throw error;
      }    
    }
  }
}