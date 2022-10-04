import { Autowired, Clazz } from 'j-spring'
import { Controller,Get,Json } from 'j-spring-web'
import { DataSource, EntityManager } from 'typeorm'
import { Tx } from '../../src'
import { Post } from '../entity/Post'

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
    async toTxSave(@Tx() e:EntityManager){

        const post = new Post();

        post.likesCount = 20;
        post.text= 'hel';
        post.title = '111111';

        const s = (post as any).constructor;

        await e.getRepository(Post).save(post);

        return post;
    }



}