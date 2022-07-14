import { OmitType } from "@nestjs/swagger";
import { IsObject, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ParamsDto } from "src/common/dto/params.dto";
import { WebNews } from "../entities/web-news.entity";

/* 新增 */
export class ReqAddConfigDto extends OmitType(WebNews, ['id'] as const) { }

/* 分页查询 */
export class ReqConfigListDto extends PaginationDto {
   
}
