import { IsNumber, IsString } from "class-validator";
import { BaseEntity } from "src/common/entities/base.entity";
import { Excel } from "src/modules/common/excel/excel.decorator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'web_news'
})
export class WebNews extends BaseEntity {
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
        name: 'link',
        length: 1000,
        default: '',
        comment: 'link'
    })
    @IsString()
    link: string

    @Column({
        name: 'image',
        length: 1000,
        default: '',
        comment: 'image'
    })
    @IsString()
    image: string
}