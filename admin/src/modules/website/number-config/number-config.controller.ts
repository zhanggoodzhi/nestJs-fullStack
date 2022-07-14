/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DataObj } from 'src/common/class/data-obj.class';
import { ApiDataResponse, typeEnum } from 'src/common/decorators/api-data-response.decorator';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { Keep } from 'src/common/decorators/keep.decorator';
import { BusinessTypeEnum, Log } from 'src/common/decorators/log.decorator';
import { RepeatSubmit } from 'src/common/decorators/repeat-submit.decorator';
import { RequiresPermissions } from 'src/common/decorators/requires-permissions.decorator';
import { User, UserEnum } from 'src/common/decorators/user.decorator';
import { PaginationPipe } from 'src/common/pipes/pagination.pipe';
import { UserInfoPipe } from 'src/common/pipes/user-info.pipe';
import { ReqAddConfigDto, ReqConfigListDto } from './dto/req-number-config.dto';
import { NumberConfig } from './entities/number-config.entity';
import { NumberConfigService } from './number-config.service';

@ApiTags('number-config')
@Controller('website/numberConfig')
export class NumberConfigController {
    constructor(
        private readonly numberConfigService: NumberConfigService,
    ) { }

    /* 新增 */
    @RepeatSubmit()
    @Post()
    @Log({
        title: 'numberConfig',
        businessType: BusinessTypeEnum.insert
    })
    async add(@Body() reqAddConfigDto: ReqAddConfigDto, @User(UserEnum.userName, UserInfoPipe) userName: string) {
        reqAddConfigDto.createBy = reqAddConfigDto.updateBy = userName
        await this.numberConfigService.addOrUpdate(reqAddConfigDto)
    }

    /* 分页查询列表 */
    @Get('list')
    @ApiPaginatedResponse(NumberConfig)
    async list(@Query(PaginationPipe) reqConfigListDto: ReqConfigListDto) {
        return await this.numberConfigService.list(reqConfigListDto)
    }


    /* 通过id查询 */
    @Get(":id")
    @ApiDataResponse(typeEnum.object, NumberConfig)
    async one(@Param('id') id: number) {
        const numberConfig = await this.numberConfigService.findById(id)
        return DataObj.create(numberConfig)
    }

    /* 修改 */
    @RepeatSubmit()
    @Put()
    @Log({
        title: 'numberConfig',
        businessType: BusinessTypeEnum.update
    })
    async updata(@Body() numberConfig: NumberConfig, @User(UserEnum.userName, UserInfoPipe) userName: string) {
        numberConfig.updateBy = userName
        await this.numberConfigService.addOrUpdate(numberConfig)
    }

    /* 删除 */
    @Delete(":ids")
    @Log({
        title: 'numberConfig',
        businessType: BusinessTypeEnum.delete
    })
    async delete(@Param('ids') ids: String) {
        await this.numberConfigService.delete(ids.split(','))
    }
}
