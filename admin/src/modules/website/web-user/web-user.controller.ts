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
import { ReqAddConfigDto, ReqConfigListDto } from './dto/req-web-user.dto';
import { WebUser } from './entities/web-user.entity';
import { WebUserService } from './web-user.service';

@ApiTags('web-user')
@Controller('website/webUser')
export class WebUserController {
    constructor(
        private readonly webUserService: WebUserService,
    ) { }

    /* 新增 */
    @RepeatSubmit()
    @Post()
    @Log({
        title: '参数设置',
        businessType: BusinessTypeEnum.insert
    })
    @RequiresPermissions('system:config:add')
    async add(@Body() reqAddConfigDto: ReqAddConfigDto, @User(UserEnum.userName, UserInfoPipe) userName: string) {
        reqAddConfigDto.createBy = reqAddConfigDto.updateBy = userName
        await this.webUserService.addOrUpdate(reqAddConfigDto)
    }

    /* 分页查询列表 */
    @Get('list')
    @RequiresPermissions('system:config:query')
    @ApiPaginatedResponse(WebUser)
    async list(@Query(PaginationPipe) reqConfigListDto: ReqConfigListDto) {
        return await this.webUserService.list(reqConfigListDto)
    }


    /* 通过id查询 */
    @Get(":id")
    @RequiresPermissions('system:config:query')
    @ApiDataResponse(typeEnum.object, WebUser)
    async one(@Param('id') id: number) {
        const webUser = await this.webUserService.findById(id)
        return DataObj.create(webUser)
    }

    /* 修改 */
    @RepeatSubmit()
    @Put()
    @Log({
        title: '参数设置',
        businessType: BusinessTypeEnum.update
    })
    @RequiresPermissions('system:config:edit')
    async updata(@Body() webUser: WebUser, @User(UserEnum.userName, UserInfoPipe) userName: string) {
        webUser.updateBy = userName
        await this.webUserService.addOrUpdate(webUser)
    }

    /* 删除 */
    @Delete(":ids")
    @Log({
        title: '参数设置',
        businessType: BusinessTypeEnum.delete
    })
    @RequiresPermissions('system:config:remove')
    async delete(@Param('ids') ids: String) {
        await this.webUserService.delete(ids.split(','))
    }
}
