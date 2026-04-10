import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './database/redis.module';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { envValidationSchema } from './config/env.validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiagnosticController } from './diagnostic/diagnostic.controller';
import { VoiceModule } from './voice/voice.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),

    // PostgreSQL & Redis (Global Modules)
    DatabaseModule,
    RedisModule,

    // Módulos de Feature
    AuthModule,
    StorageModule,

    // MongoDB Atlas
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),

    VoiceModule,

    RoomsModule,
  ],
  controllers: [AppController, DiagnosticController],
  providers: [AppService],
})
export class AppModule {}
