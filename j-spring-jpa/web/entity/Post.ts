import { Column, Entity } from "typeorm"
import { PrimaryColumn } from "typeorm"
import { Generated } from "typeorm"
import { Table } from "../../src"

@Table()
@Entity("sample01_post")
export class Post {
    @PrimaryColumn()
    @Generated()
    id: number

    @Column()
    title: string

    @Column()
    text: string

    @Column({ nullable: false })
    likesCount: number
}
