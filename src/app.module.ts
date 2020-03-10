import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TerminusModule } from '@nestjs/terminus';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TerminusOptionsService } from './modules/terminus/terminus.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    ),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
    PassportModule,
    UsersModule,
    AuthModule,
    TerminusModule.forRootAsync({
      useClass: TerminusOptionsService,
    }),
  ],
})
export class AppModule {}
