import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../src";


@Entity('Image')
export class Image extends BaseEntity<Image>{

    @Column()
    name:string;

}