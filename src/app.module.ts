import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './configuration/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { UserModule } from './user/user.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { RecipeModule } from './recipe/recipe.module';
import { RatingModule } from './rating/rating.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('database.host'),
        port: config.get('database.port'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        database: config.get('database.name'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    AuthModule,
    UserModule,
    IngredientModule,
    RecipeModule,
    RatingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
