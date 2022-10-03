import { Component, Value } from 'j-spring';
import path from 'path';
import { ExpressConfiguration } from './springWebExtends'
import {errorInfo,SpringWebExceptionHandler} from './springWebExtends'
import session from 'express-session'
import bodyParser from 'body-parser'


/**
 * ejs页面配置
 */
@Component()
export class EjsViewConfigruation implements ExpressConfiguration {

    @Value({path:'root',type:String})
    root:string;

    @Value({path:'express.viewPath',type:String,force:false})
    viewPath:string = 'view';

    load(app: any): void {
        app.set('views', path.join(this.root,this.viewPath));
        app.set('view engine', 'ejs');
    }
    
    isExpressConfiguration(): boolean {
        return true;
    }

}

/** express 内存-session 仅适用于开发模式 */
@Component()
export class ExpressMemorySessionConfiguration implements ExpressConfiguration {

    @Value({path:'express.session.secret',type:String,force:false})
    secret:string = 'kity';
    @Value({path:'express.session.maxAge',type:Number,force:false})
    maxAge:number = 60000;

    load(app: any): void {
        app.use(session({
            secret:this.secret,
            cookie:{
                maxAge:this.maxAge
            }
        }))
    }
    isExpressConfiguration(): boolean {
        return true;
    }
}

@Component()
export class BodyParseConfiguration implements ExpressConfiguration {
    load(app: any): void {
        // parse application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: false }))
        // parse application/json
        app.use(bodyParser.json())
    }
    isExpressConfiguration(): boolean {
        return true;        
    }

}

/**
 * 默认异常处理
 */
export class SpringWebExceptionHandlerConfigration implements SpringWebExceptionHandler {
    isSpringWebExceptionHandler(): boolean {
        return true;
    }

    hanlder(_req: any, res: any, errorInfo: errorInfo): void {
        console.log(errorInfo.error)
        res.status(500).json({error:errorInfo.error})
    }

}

