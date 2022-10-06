import { Autowired, Clazz } from 'j-spring'
import { Controller,Get,Json } from 'j-spring-web'
import { DataSource} from 'typeorm'
import { Tx } from '../../src'
import { SpringTx } from '../../src/springTx'
import { Image } from '../entity/Image'
import { Post, PostSearch } from '../entity/Post'




@Controller('testApi')
@Json()
export class TestApiController {

    @Autowired({clazz:DataSource as Clazz})
    dataSource:DataSource

    @Get()
    async toMsg(){
        return 'hello'
    }


    @Get()
    async toTestTx(@Tx() tx:SpringTx){

        const postList:Post[] = [];

        for(let i =0 ;i<100;i++){
            const post = new Post().of({
                image:new Image().of({
                    name:'heloa'
                }),
                title:'hello',
                likesCount:100,
                text:'a lot str'
            })
            postList.push(post);
        }

        await tx.save(postList);

        if(Math.random()>0.5)
            throw 'occur error!'

        return postList;
    }

    @Get()
    async toUseSearch(@Tx() tx:SpringTx){
        const s = new PostSearch().of({
            likesCount_not:-1,
            image$name_like:'he%',
            pageSize:5,
            likesCount_between:[-50,2]
        });
        return await tx.find(s.usePagin());
    }

    @Get()
    async updateData(@Tx() tx:SpringTx){
        const s = new PostSearch().of({
            likesCount:-1,
            image$name:'heloa'
        });
        const postList = await tx.find(s);

        postList.forEach(p => p.likesCount=-1);

        await tx.update(postList);

        return postList;

    }

    @Get()
    async batchUpdate(@Tx() tx:SpringTx) {

        const updateSize = await tx.batchUpdate(new PostSearch().of({
            image$name:'heloa'
        }),{
            text:'helalala'
        });

        return updateSize;

    }

    @Get()
    async getPost(@Tx() tx:SpringTx){
        return await tx.e.find(Post,{
            take:5,
            where:{
                image:{
                    name:'heloa'
                }
            },
            relationLoadStrategy:'query',
            relations:{
                image:true,
            },
            comment:'this is test query',
            cache:60*1000
        })
    }


}