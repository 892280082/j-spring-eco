import { Column, Entity } from "typeorm"
import { Table } from "../../src"
import { BasePojo, BaseSearch } from '../springOrm/SpringEntity'

@Table()
@Entity("sample01_post")
export class Post extends BasePojo<Post> {

    @Column()
    title: string

    @Column()
    text: string

    @Column({ nullable: false })
    likesCount: number
}



export class PostSearch extends BaseSearch<Post,PostSearch> {

    constructor(){
        super(Post)
    }

    title:string;

    title_fuzzy:string;

    likesCount:number;

}
