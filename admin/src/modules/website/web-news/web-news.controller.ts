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
import { ReqAddConfigDto, ReqConfigListDto } from './dto/req-web-news.dto';
import { WebNews } from './entities/web-news.entity';
import { WebNewsService } from './web-news.service';

@ApiTags('web-user')
@Controller('website/webNews')
export class WebNewsController {
    constructor(
        private readonly webNewsService: WebNewsService,
    ) { }

    /* 新增 */
    @RepeatSubmit()
    @Post()
    @Log({
        title: 'websiteUser',
        businessType: BusinessTypeEnum.insert
    })
    async add(@Body() reqAddConfigDto: ReqAddConfigDto, @User(UserEnum.userName, UserInfoPipe) userName: string) {
        reqAddConfigDto.createBy = reqAddConfigDto.updateBy = userName
        await this.webNewsService.addOrUpdate(reqAddConfigDto)
    }

    /* 分页查询列表 */
    @Get('list')
    @ApiPaginatedResponse(WebNews)
    async list(@Query(PaginationPipe) reqConfigListDto: ReqConfigListDto) {
        return await this.webNewsService.list(reqConfigListDto)
    }


    /* 通过id查询 */
    @Get(":id")
    @ApiDataResponse(typeEnum.object, WebNews)
    async one(@Param('id') id: number) {
        const webNews = await this.webNewsService.findById(id)
        return DataObj.create(webNews)
    }

    /* 修改 */
    @RepeatSubmit()
    @Put()
    @Log({
        title: 'websiteUser',
        businessType: BusinessTypeEnum.update
    })
    async updata(@Body() webNews: WebNews, @User(UserEnum.userName, UserInfoPipe) userName: string) {
        webNews.updateBy = userName
        await this.webNewsService.addOrUpdate(webNews)
    }

    /* 删除 */
    @Delete(":ids")
    @Log({
        title: 'websiteUser',
        businessType: BusinessTypeEnum.delete
    })
    async delete(@Param('ids') ids: String) {
        await this.webNewsService.delete(ids.split(','))
    }
}
