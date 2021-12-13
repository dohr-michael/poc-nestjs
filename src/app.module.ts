import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {  } from '@nestjs/cqrs';
import { MongoModule } from '~/tools/mongo';
import { AppController } from './app.controller';
import { SchoolsModule } from './_archive/schools/schools.module';
import configuration from './config/configuration';

@Module({
    imports: [
        ConfigModule.forRoot({ load: [ configuration ] }),
        MongoModule.forRootAsync(),
        SchoolsModule,
    ],
    controllers: [ AppController ],
    providers: [],
})
export class AppModule {}
