import { User } from "src/user/entity/user.entity";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./service/auth.service";
import { TypeOrmModule } from "@nestjs/typeorm/dist/typeorm.module";
import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}