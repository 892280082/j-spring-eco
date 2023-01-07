import { Component, Value, springLog } from 'j-spring';
import rootPath from 'app-root-path';
import path from 'path';
import morgan from 'morgan';
import { ExpressMiddleWare } from './springWebAnnotation';
import { ExpressConfiguration } from './springWebExtends';
import { errorInfo, SpringWebExceptionHandler } from './springWebExtends';
import { ExpressApp } from './springReflectType';

/**
 * ejs页面配置
 */
@Component()
export class EjsViewConfigruation implements ExpressConfiguration {
  load(app: ExpressApp): void {
    app.set('views', path.join(this.root, this.viewPath));
    app.set('view engine', 'ejs');
  }
  @Value({ path: 'express.view.root', remark: '视图根目录', force: false })
  root: string = rootPath.resolve('./');

  @Value({ path: 'express.view.dir', remark: '视图目录', force: false })
  viewPath: string = 'view';

  isExpressConfiguration(): boolean {
    return true;
  }
}

/** express 内存-session 仅适用于开发模式 */
@Component()
export class ExpressMemorySessionConfiguration implements ExpressConfiguration {
  load(app: ExpressApp): void {
    const session = require('express-session');
    app.use(
      session({
        secret: this.secret,
        cookie: {
          maxAge: this.maxAge,
        },
      })
    );
  }
  @Value({ path: 'express.session.secret', remark: '仅用于测试', force: false })
  secret: string = 'kity';
  @Value({ path: 'express.session.maxAge', remark: '仅用于测试', force: false })
  maxAge: number = 60000;

  isExpressConfiguration(): boolean {
    return true;
  }
}

@Component()
export class BodyParseConfiguration implements ExpressConfiguration {
  load(app: ExpressApp): void {
    const bodyParser = require('body-parser');
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));
    // parse application/json
    app.use(bodyParser.json());
  }
  isExpressConfiguration(): boolean {
    return true;
  }
}

/**
 * 跨域中间件
 */
@Component()
export class CorresDomainMiidleWare implements ExpressMiddleWare {
  isExpressMidldleWare(): boolean {
    return true;
  }
  invoke(_req: any, res: any, next: Function): void {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('X-Powered-By', ' 3.2.1');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
  }
}

/**
 * 默认异常处理
 */
export class SpringWebExceptionHandlerConfigration
  implements SpringWebExceptionHandler {
  isSpringWebExceptionHandler(): boolean {
    return true;
  }

  hanlder(_req: any, res: any, errorInfo: errorInfo): void {
    console.log(errorInfo.error);
    res.status(500).json({ error: errorInfo.error });
  }
}

@Component()
export class MorganLogConfigruation implements ExpressConfiguration {
  // Define message format string (this is the default one).
  // The message format is made from tokens, and each token is
  // defined inside the Morgan library.
  // You can create your custom token to show what do you want from a request.
  @Value({ path: 'morgan.regular', force: false })
  regular: string =
    ':remote-addr :method :url :status :res[content-length] - :response-time ms';

  load(app: ExpressApp): void {
    const stream = {
      // Use the http severity
      write: (message: any) => {
        springLog.http(message);
      },
    };

    const morganMiddleware = morgan(this.regular, { stream });

    app.use(morganMiddleware);
  }
  isExpressConfiguration(): boolean {
    return true;
  }
}
