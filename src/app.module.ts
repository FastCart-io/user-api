import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user';
import { MongoUri_s } from './interfaces/mongo.interface';

import configuration from './config/configuration';


@Module({
  imports: [
    
    ConfigModule.forRoot({
      envFilePath: [
        '.env.local'
      ],
      load: [configuration],
      isGlobal: true
    }),

    MongooseModule.forRootAsync({
      
      useFactory: async (configService: ConfigService) => {

        const dbConfig = configService.get<MongoUri_s>('database')

	return { 
          uri: `mongodb://${dbConfig.user}:${dbConfig.passwd}@${dbConfig.host}:${dbConfig.port}`, 
          dbName: '2doCarts'
        }
      },

      inject: [ConfigService]
    }),

    UserModule
  ],
  controllers: [AppController],
  providers: [AppService, User],
})
export class AppModule {}
