import { User } from "src/user/entity/user.entity";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./service/auth.service";
import { TypeOrmModule } from "@nestjs/typeorm/dist/typeorm.module";
import { Module } from "@nestjs/common/decorators/modules/module.decorator";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}