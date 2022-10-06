import { Column } from "typeorm";
import { SpringEntity,BaseEntity } from "../../src";


@SpringEntity('Image')
export class Image extends BaseEntity<Image>{

    @Column()
    name:string;

}