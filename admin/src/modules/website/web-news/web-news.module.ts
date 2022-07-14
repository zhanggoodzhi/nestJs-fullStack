import { WebNewsService } from './web-news.service';
import { WebNewsController } from './web-news.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebNews } from './entities/web-news.entity';

@Module({
    imports: [TypeOrmModule.forFeature([WebNews])],
    controllers: [
        WebNewsController,],
    providers: [
        WebNewsService,],
})
export class WebNewsModule { }
