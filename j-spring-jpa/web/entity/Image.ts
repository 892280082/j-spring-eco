import { Column, Entity } from "typeorm";
import { SpringEntity } from "../../src";
import { BasePojo } from "../springOrm/SpringEntity";


@SpringEntity('Image')
export class Image extends BasePojo<Image>{

    @Column()
    name:string;

}