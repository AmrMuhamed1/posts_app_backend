import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { UserService } from "./user.service";
import { LoginUserDto } from "./dtos/login-user.dto";
import { AuthGuard } from "./gaurds/user-auth.gurad";
import { AdminInterceptor } from "./interceptors/admin.interceptor";
import { UserIdInterceptor } from "./interceptors/user-id.interceptor";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number; // Adjust based on your actual user object structure
        // Add other properties if needed
      };
    }
  }
}
@Controller("api/users")
export class UsersController {
  constructor(private userService: UserService) {}

  @Post("/auth/register")
  @UseInterceptors(ClassSerializerInterceptor)
  register(@Body() body: RegisterDto) {
    return this.userService.register(body);
  }

  @Post("auth/login")
  @UseInterceptors(ClassSerializerInterceptor)
  login(@Body() body: LoginUserDto) {
    return this.userService.login(body);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get("/:id")
  getProfile(@Param("id") id: string) {
    return this.userService.getProfile(id);
  }


  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/auth/verify')
  verifyAccount(@Req() req: Request) {
    return this.userService.verifyAccount(req.user.id);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(AdminInterceptor) // Use the interceptor here
  @Get()
  getAllUser() {
    return this.userService.getAllUsers();
  }

  @Put("/:id")
  @UseGuards(AuthGuard)
  @UseInterceptors(AdminInterceptor)
  changeUserAdmin(@Param("id", ParseIntPipe) id: number) {
    return this.userService.changeUserAdmin(id);
  }

  @Put("/profile/image")
  @UseGuards(AuthGuard)
  @UseInterceptors(UserIdInterceptor)
  @UseInterceptors(FileInterceptor("file"))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request
  ) {
    const result = await this.userService.uploadImage(
      file,
      request.user.id.toString()
    );
    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  }
  @Delete("/image/remove")
  @UseGuards(AuthGuard)
  @UseInterceptors(UserIdInterceptor)
  async removeProfileImage(@Req() req: Request) {
    const userId = req.user?.id;
    await this.userService.removeImage(userId);
    return { message: "Profile image removed successfully" };
  }
}
