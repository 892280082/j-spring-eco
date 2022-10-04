import { Autowired, Clazz } from 'j-spring'
import { Controller,Get,Json } from 'j-spring-web'
import { DataSource, EntityManager ,ObjectLiteral,EntityTarget,Repository} from 'typeorm'
import { Tx } from '../../src'
import { Post } from '../entity/Post'
import { SpringTx } from '../springOrm/SpringEntity'




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

    @Get()
    async waitSave(@Tx() e:EntityManager){

        const post = new Post();

        post.likesCount = 20;
        post.text= 'hel';
        post.title = '33333';

        const s = (post as any).constructor;

        await e.getRepository(Post).save(post);

        const waitSave = ()=> new Promise( (ok,_error)=>{
            setTimeout(ok,5000)
        })

        await waitSave();

        return post;

    }

    @Get()
    async saveDiyTx(@Tx() e:EntityManager){

        const springTx = new SpringTx(e);

        const post = new Post();
        post.likesCount = 20;
        post.text= '333hel';
        post.title = '443333';

        const findPost2 = await e.find(Post,{where:{id:25}})

        const findPost = await springTx.e.getRepository(Post).findBy({id:25});

        for (const p of findPost) {
            //await p.remove(springTx);
            p.likesCount = 100;
            await p.update(springTx);
        }

        await post.save(springTx);

        return post;
    }





}