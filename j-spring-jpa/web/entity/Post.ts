import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { Image } from "./Image"
import {BaseEntity,BaseSearch } from '../../src'

@Entity('Post')
export class Post extends BaseEntity<Post> {

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
        this.relation({
            image:true
        })
        this.order({
            id:'DESC'
        })
        this.relatirelationLoadStrategy('query')
    }

    title:string;

    likesCount:number;

    likesCount_not:number;

    image$name:string;

    image$name_like:string;

    likesCount_between:number[];

}
