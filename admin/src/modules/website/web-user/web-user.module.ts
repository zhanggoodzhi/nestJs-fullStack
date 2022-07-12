import { WebUserService } from './web-user.service';
import { WebUserController } from './web-user.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebUser } from './entities/web-user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([WebUser])],
    controllers: [
        WebUserController,],
    providers: [
        WebUserService,],
})
export class WebUserModule { }
