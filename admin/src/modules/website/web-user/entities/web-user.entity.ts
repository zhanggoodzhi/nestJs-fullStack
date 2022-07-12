import { IsNumber, IsString } from "class-validator";
import { BaseEntity } from "src/common/entities/base.entity";
import { Excel } from "src/modules/common/excel/excel.decorator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'web-user'
})
export class WebUser extends BaseEntity {
    /* 参数主键 */
    @PrimaryGeneratedColumn({
        name: 'id',
        comment: 'id'
    })
    @IsNumber()
    id: number


    @Column({
        name: 'name',
        length: 100,
        default: '',
        comment: 'name'
    })
    @IsString()
    name: string

    @Column({
        name: 'introduction',
        length: 100,
        default: '',
        comment: 'introduction'
    })
    @IsString()
    introduction: string

    @Column({
        name: 'article',
        length: 1000,
        default: '',
        comment: 'article'
    })
    @IsString()
    article: string
}