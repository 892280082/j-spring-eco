import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { BasePojo, BaseSearch } from '../springOrm/SpringEntity'
import { Image } from "./Image"
import {SpringEntity } from '../../src'

@SpringEntity('Post')
export class Post extends BasePojo<Post> {

    @Column()
    title:string

    @Column()
    text:string

    @Column({ nullable: false })
    likesCount:number

    @JoinColumn()
    @OneToOne(()=>Image,{cascade:true})
    image:Image;
}



export class PostSearch extends BaseSearch<Post,PostSearch> {

    constructor(){
        super(Post)
    }

    title:string;

    title_fuzzy:string;

    likesCount:number;

}
