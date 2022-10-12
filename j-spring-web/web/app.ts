import { Component, spring } from 'j-spring';
import { springWebModule,EjsViewConfigruation,BodyParseConfiguration,ExpressMemorySessionConfiguration,SpringWebExceptionHandler,MorganLogConfigruation } from '../src'
import { errorInfo, ExpressServer } from '../src/springWebExtends';
import { StudentController,XiaoAiController } from './controller/StudentController'
import { ShuttleApi } from './controller/ShuttleApi'
import { IndexController } from './controller/IndexController';
import path from 'path';

@Component()
class CustomSpringWebExceptionHandler implements SpringWebExceptionHandler {
    isSpringWebExceptionHandler(): boolean {
        return true;
    }
    hanlder(_req: any, res: any, errorInfo: errorInfo): void {
       console.log(`this is diy error info`)
       res.json(errorInfo.error)
    }
    
}

//SpringWeb 配置
const springWebConfig = [
    EjsViewConfigruation,
    ExpressMemorySessionConfiguration,
    BodyParseConfiguration,
    CustomSpringWebExceptionHandler,
    MorganLogConfigruation
]

//请求控制器
const controllerClassList = [
    IndexController,
    StudentController,
    XiaoAiController,
    ShuttleApi
]

export async function start(port:number){
    const config = {
        'j-spring':{
            log:{
                level:'info,http'
            }
        },
        'j-spring-web':{
            port
        },
        express:{
            view:{
                root:path.resolve(__dirname)
            }
        },
        'indexMsg':'j-spring',
    }
    await spring.loadConfig(config).bindModule([springWebModule,springWebConfig,controllerClassList]).invokeStarter();
}

export function end(done:Function){
    const server = spring.getBeanFromContainer(ExpressServer)
    if(server){
        server.close(done);
    }
}