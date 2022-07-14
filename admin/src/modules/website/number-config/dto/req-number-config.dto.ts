import { OmitType } from "@nestjs/swagger";
import { IsObject, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ParamsDto } from "src/common/dto/params.dto";
import { NumberConfig } from "../entities/number-config.entity";

/* 新增 */
export class ReqAddConfigDto extends OmitType(NumberConfig, ['id'] as const) { }

/* 分页查询 */
export class ReqConfigListDto extends PaginationDto {
   
}
