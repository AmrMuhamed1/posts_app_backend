import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  Post
} from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { RegisterDto } from "./dtos/register.dto";
import { Repository } from "typeorm";
import { User, userType } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcryptjs";
import { LoginUserDto } from "./dtos/login-user.dto";
import { JwtService } from "@nestjs/jwt";
import { Readable } from "typeorm/platform/PlatformTools";
import { MailService } from "src/utils/mail.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, userName } = registerDto;

    const userFormDb = await this.repo.findOne({ where: { email } });

    if (userFormDb) throw new BadRequestException("user already exist");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser = this.repo.create({
      email,
      userName,
      password: hashedPassword
    });

    newUser = await this.repo.save(newUser);

    const payload = { id: newUser.id, admin: newUser.userType };

    const token = await this.jwtService.signAsync(payload);

    await this.mailService.sendVerificationEmail(email, token);

    return {
      token,
      newUser
    };
  }

  async login(body: LoginUserDto) {
    // Find the user by email
    let user = await this.repo.findOne({ where: { email: body.email } });
    if (!user) throw new BadRequestException("User does not exist");

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch)
      throw new BadRequestException("Email or password is incorrect");

    const payload = { id: user.id, admin: user.userType };

    const token = await this.jwtService.signAsync(payload);

    // return the user
    return {
      token,
      user
    };
  }

  async verifyAccount(userId: number) {
    const user = await this.repo.findOne({ where: { id: userId } });

    if (user) {
      user.isAccountVerified = true; // Assume you have an isVerified field
      await this.repo.save(user);
    }
    return user;
  }

  async getProfile(id: string) {
    return this.repo.findOneBy({ id: parseInt(id) });
  }

  async getAllUsers() {
    return this.repo.find();
  }

  async changeUserAdmin(id: number) {
    let user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.userType === userType.NORMAL_USER) {
      user.userType = userType.ADMIN;
      await this.repo.save(user);
      return user;
    } else {
      user.userType = userType.NORMAL_USER;
      return user;
    }
  }

  async uploadImage(file: Express.Multer.File, userId: string): Promise<any> {
    const user = await this.getProfile(userId);

    // Ensure profileImage is initialized
    if (!user.profileImage) {
      user.profileImage = {}; // Initialize it as an empty object
    }

    if (user.profileImage?.publicId) {
      await cloudinary.uploader.destroy(user.profileImage.publicId);
    }

    const stream = new Readable();
    stream.push(file.buffer);
    stream.push(null);
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        async (error, result) => {
          if (error) {
            reject(error);
          } else {
            // Set the properties
            user.profileImage.url = result.secure_url;
            user.profileImage.publicId = result.public_id;

            // Save the updated user
            await this.repo.save(user);
            resolve(result);
          }
        }
      );
      stream.pipe(uploadStream);
    });
  }

  async removeImage(userId: number): Promise<void> {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");
    // Remove the image from Cloudinary if it exists
    if (user.profileImage?.publicId) {
      await cloudinary.uploader.destroy(user.profileImage.publicId);
      user.profileImage = null;
      await this.repo.save(user);
    } else {
      throw new Error("No profile image to remove");
    }
  }
}
