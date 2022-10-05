import { Column, JoinColumn, OneToOne } from "typeorm"
import { Image } from "./Image"
import {SpringEntity,BaseEntity,BaseSearch } from '../../src'

@SpringEntity('Post')
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
    }

    title:string;

    likesCount:number;

    image$name:string;
    
}
