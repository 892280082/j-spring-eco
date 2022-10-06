import { spring } from 'j-spring'
import { springWebModule } from 'j-spring-web'
import { SqliteModule } from '../src'
import path from 'path'
import { Post } from './entity/Post'
import { Image } from './entity/Image'
import { TestApiController } from './controller/TestApiController'


const config = {
    'j-spring-jpa.sqlite.database':path.join(__dirname,'./data.db'),
}

const entityList = [Post,Image]

const controllerList = [TestApiController]

spring.bindModule([SqliteModule,springWebModule,entityList,controllerList]).loadConfig(config).invokeStarter();