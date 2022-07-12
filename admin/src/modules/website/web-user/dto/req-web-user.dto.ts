import { OmitType } from "@nestjs/swagger";
import { IsObject, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ParamsDto } from "src/common/dto/params.dto";
import { WebUser } from "../entities/web-user.entity";

/* 新增 */
export class ReqAddConfigDto extends OmitType(WebUser, ['id'] as const) { }

/* 分页查询 */
export class ReqConfigListDto extends PaginationDto {
   
}
