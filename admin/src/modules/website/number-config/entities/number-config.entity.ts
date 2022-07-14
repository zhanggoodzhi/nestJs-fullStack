import { IsNumber, IsString } from "class-validator";
import { BaseEntity } from "src/common/entities/base.entity";
import { Excel } from "src/modules/common/excel/excel.decorator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'number_config'
})
export class NumberConfig extends BaseEntity {
    /* 参数主键 */
    @PrimaryGeneratedColumn({
        name: 'id',
        comment: 'id'
    })
    @IsNumber()
    id: number


    @Column({
        name: 'userCount',
        length: 100,
        default: '',
        comment: 'userCount'
    })
    @IsString()
    userCount: string

    @Column({
        name: 'PredictionCount',
        length: 100,
        default: '',
        comment: 'PredictionCount'
    })
    @IsString()
    PredictionCount: string

    @Column({
        name: 'AlertCount',
        length: 100,
        default: '',
        comment: 'AlertCount'
    })
    @IsString()
    AlertCount: string

    @Column({
        name: 'DashboardCount',
        length: 100,
        default: '',
        comment: 'DashboardCount'
    })
    @IsString()
    DashboardCount: string

}