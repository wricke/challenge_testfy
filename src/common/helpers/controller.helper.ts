import {
  Controller as NestController,
  applyDecorators,
  Get as NestGet,
  Post as NestPost,
  Delete as NestDelete,
  Put as NestPut,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiResponseOptions } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ResponseDto } from '../interfaces/response.dto';
import { CommonMessages } from '../enums/messages.enum';

export const Controller = (name = '', needAuth?: boolean): MethodDecorator & ClassDecorator => {  
  return applyDecorators(
    NestController(name),
    ApiTags(name),
    needAuth ? ApiBearerAuth() : (): boolean => false
  );
};

const ResponseDecorators = (method: MethodDecorator, responses: ApiResponseOptions[], needAuth: boolean): MethodDecorator & ClassDecorator => {
  return applyDecorators(
    needAuth ? UseGuards(AuthGuard('jwt')) : (): boolean => false,
    needAuth ? ApiBearerAuth() : (): boolean => false,
    method,
    ...responses.map(
      response => ApiResponse(Object.assign({ type: ResponseDto }, response)),
    ).concat(needAuth ? ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: CommonMessages.UNAUTHORIZED }) : []),
  );
};

export const Get = (
  name = '',
  needAuth: boolean,
  ...responses: ApiResponseOptions[]
): MethodDecorator & ClassDecorator => {
  return ResponseDecorators(
    NestGet(name),
    responses.length ? responses : [{ type: ResponseDto, status: HttpStatus.OK }],
    needAuth,
  );
};

export const Post = (
  name = '',
  needAuth: boolean,
  ...responses: ApiResponseOptions[]
): MethodDecorator & ClassDecorator => {
  return ResponseDecorators(
    NestPost(name),
    (responses.length ? responses : [{ type: ResponseDto, status: HttpStatus.CREATED }])
      .concat([{ status: HttpStatus.BAD_REQUEST, description: CommonMessages.BAD_REQUEST, type: ResponseDto }]),
    needAuth,
  );
};

export const Delete = (
  name = '',
  needAuth: boolean,
  ...responses: ApiResponseOptions[]
): MethodDecorator & ClassDecorator => {
  return ResponseDecorators(
    NestDelete(name),
    responses.length ? responses : [{ type: ResponseDto, status: HttpStatus.OK }],
    needAuth,
  );
};

export const Put = (
  name = '',
  needAuth: boolean,
  ...responses: ApiResponseOptions[]
): MethodDecorator & ClassDecorator => {
  return ResponseDecorators(
    NestPut(name),
    (responses.length ? responses : [{ type: ResponseDto, status: HttpStatus.OK }])
      .concat([{ status: HttpStatus.BAD_REQUEST, description: CommonMessages.BAD_REQUEST, type: '' }]),
    needAuth,
  );
};