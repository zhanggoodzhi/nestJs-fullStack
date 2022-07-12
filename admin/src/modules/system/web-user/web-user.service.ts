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
import { ReqAddConfigDto, ReqConfigListDto } from './dto/req-web-user.dto';
import { WebUser } from './entities/web-user.entity';
import { SYSCONFIG_KEY } from './web-user.contant';

@Injectable()
export class WebUserService {
    constructor(
        @InjectRepository(WebUser) private readonly webUserRepository: Repository<WebUser>,
        @InjectRedis() private readonly redis: Redis
    ) { }

    /* 新增或更改 */
    async addOrUpdate(reqAddConfigDto: ReqAddConfigDto) {
        const webUser = await this.findByConfigKey(reqAddConfigDto.configKey, (reqAddConfigDto as WebUser).configId)
        if (webUser) throw new ApiException('参数键值已存在，请更换')
        return await this.webUserRepository.save(reqAddConfigDto)
    }

    /* 分页查询 */
    async list(reqConfigListDto: ReqConfigListDto): Promise<PaginatedDto<WebUser>> {
        let where: FindConditions<WebUser> = {}
        if (reqConfigListDto.configName) {
            where.configName = Like(`%${reqConfigListDto.configName}%`)
        }
        if (reqConfigListDto.configKey) {
            where.configKey = Like(`%${reqConfigListDto.configKey}%`)
        }
        if (reqConfigListDto.configType) {
            where.configType = reqConfigListDto.configType
        }
        if (reqConfigListDto.params) {
            where.createTime = Between(reqConfigListDto.params.beginTime, moment(reqConfigListDto.params.endTime).add(1, 'day').format())
        }
        const result = await this.webUserRepository.findAndCount({
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
    async findById(configId: number | string) {
        return await this.webUserRepository.findOne(configId)
    }

    /* 通过id数组删除 */
    async delete(configIdArr: number[] | string[]) {
        return await this.webUserRepository.delete(configIdArr)
    }

    /* 通过字参数键名查询 */
    async findByConfigKey(configKey: string, configId?: number) {
        let where: FindConditions<WebUser> = { configKey }
        if (configId) {
            where.configId = Not(configId)
        }
        return await this.webUserRepository.findOne({ where })
    }

    /* 通过参数键名 懒查询参数值,并缓存进入redis  */
    async lazyFindByConfigKey(configKey: string) {
        let configValue = await this.redis.get(`${SYSCONFIG_KEY}:${configKey}`)
        if (configValue) {
            return configValue
        } else {
            const webUser = await this.webUserRepository.findOne({ configKey })
            configValue = webUser ? webUser.configValue : ''
            await this.redis.set(`${SYSCONFIG_KEY}:${configKey}`, configValue)
            return configValue
        }
    }

    /* 清除缓存数据 */
    async refreshCache() {
        const keyArr = await this.redis.keys(`${SYSCONFIG_KEY}:*`)
        if (keyArr && keyArr.length) {
            await this.redis.del(keyArr)
        }
    }
}
