import { NumberConfigService } from './number-config.service';
import { NumberConfigController } from './number-config.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NumberConfig } from './entities/number-config.entity';

@Module({
    imports: [TypeOrmModule.forFeature([NumberConfig])],
    controllers: [
        NumberConfigController,],
    providers: [
        NumberConfigService,],
})
export class NumberConfigModule { }
