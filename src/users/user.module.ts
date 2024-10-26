import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthGuard } from "./gaurds/user-auth.gurad";
import { CloudinaryProvider } from "src/utils/cloudinary.config";
import { MailService } from "src/utils/mail.service";

@Module({
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>("TOKEN_SECRET_KEY"),
        signOptions: { expiresIn: configService.get<string>("TOKEN_EXPIRE_IN") }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [UserService, AuthGuard, CloudinaryProvider, MailService],
  exports: [AuthGuard, JwtModule, UserService]
})
export class UserModule {}
