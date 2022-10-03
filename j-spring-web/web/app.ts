import { Component, spring } from 'j-spring';
import { springWebModule,EjsViewConfigruation,BodyParseConfiguration,ExpressMemorySessionConfiguration,SpringWebExceptionHandler } from '../src'
import { errorInfo } from '../src/springWebExtends';
import { IndexController } from "./controller/IndexController";
import { StudentController,XiaoAiController } from './controller/StudentController'

@Component()
class CustomSpringWebExceptionHandler implements SpringWebExceptionHandler {
    isSpringWebExceptionHandler(): boolean {
        return true;
    }
    hanlder(req: any, res: any, errorInfo: errorInfo): void {
       console.log(`this is diy error info`)
       res.json(errorInfo.error)
    }
    
}

//SpringWeb 配置
const springWebConfig = [
    EjsViewConfigruation,
    ExpressMemorySessionConfiguration,
    BodyParseConfiguration,
    CustomSpringWebExceptionHandler
]

//请求控制器
const controllerClassList = [
    //IndexController,
    StudentController,
    XiaoAiController
]


spring.bindModule([springWebModule,springWebConfig,controllerClassList]).loadConfig({'indexMsg':'j-spring','root':__dirname}).invokeStarter();