/*
https://docs.nestjs.com/providers#services
*/

import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { ApiException } from 'src/common/exceptions/api.exception';
import { Between, FindConditions, Like, Not, Repository } from 'typeorm';
import { ReqAddConfigDto, ReqConfigListDto } from './dto/req-number-config.dto';
import { NumberConfig } from './entities/number-config.entity';
import { SYSCONFIG_KEY } from './number-config.contant';

@Injectable()
export class NumberConfigService { 
    constructor(
        @InjectRepository(NumberConfig) private readonly numberConfigRepository: Repository<NumberConfig>,
        @InjectRedis() private readonly redis: Redis
    ) { }

    /* 新增或更改 */
    async addOrUpdate(reqAddConfigDto: ReqAddConfigDto) {
        return await this.numberConfigRepository.save(reqAddConfigDto)
    }

    /* 分页查询 */
    async list(reqConfigListDto: ReqConfigListDto): Promise<PaginatedDto<NumberConfig>> {
        let where: FindConditions<NumberConfig> = {}
        const result = await this.numberConfigRepository.findAndCount({
            where,
            skip: reqConfigListDto.skip,
            take: reqConfigListDto.take
        })
        return {
            rows: result[0],
            total: result[1],
        }
    }

    /* 通过id查询 */
    async findById(id: number | string) {
        return await this.numberConfigRepository.findOne(id)
    }

    /* 通过id数组删除 */
    async delete(idArr: number[] | string[]) {
        return await this.numberConfigRepository.delete(idArr)
    }
}
