import { existsSync } from 'fs';
import {
  Anntation,
  assemble,
  BeanDefine,
  Clazz,
  getBeanDefineByClass,
  MethodDefine,
  createDebugLogger,
} from 'j-spring';
import path from 'path';
import { ExpressApp, Request, Response } from './springReflectType';
import {
  Controller,
  Get,
  Post,
  RequestMapping,
  ExpressMiddleWare,
  MappingParam,
  ApiMiddleWare,
  MiddleWareParam,
  MiddleWare,
  Shuttle,
  middleWareType,
  Render,
  ApiRemark,
  ApiRemarkParam,
} from './springWebAnnotation';
import {
  ExpressLoad,
  SpringWebParamInteceptor,
  SpringWebExceptionHandler,
} from './springWebExtends';
import { paramInterceptor } from './springWebParamIntecepor';

const logger = createDebugLogger('WebRouteDelegate:');

type paramContainer = {
  inteceptor: SpringWebParamInteceptor<any> | undefined;
  bean: any;
};

type MethodRouterParm = {
  index: number;
  bean: any;
  bd: BeanDefine;
  md: MethodDefine;
  exceptionHandler: () => SpringWebExceptionHandler;
};

class MethodRouter {
  index: number;
  hasShuttle: boolean;
  hasGet: boolean;
  hasPost: boolean;
  hasRequestMapping: boolean;

  invokeMethod: string; //get post use

  sendType: string = 'json'; // 默认都是发送json

  reqPath: string; //请求路径

  maxParamLength: number; //最大参数数量

  middleWareFunction: Function[]; //中间件函数

  apiRemark: string = ''; //备注

  error(msg: string) {
    throw new Error(
      `class:${this.option.bd.clazz} method:${this.option.md.name} router analysis error:${msg}`
    );
  }

  private resolveInokeMethod(): string {
    if (this.hasRequestMapping) return 'use';
    if (this.hasGet && this.hasPost) return 'use';
    if (this.hasGet) return 'get';
    if (this.hasPost) return 'post';
    this.error('_resolveInokeMethod error');
    return '';
  }

  private resolveSendType(app: any): void {
    const { md, bd } = this.option;
    if (md.hasAnnotation(Render)) {
      if (
        !existsSync(
          path.join(app.get('views'), md.getAnnotation(Render)?.params.path)
        )
      )
        throw `类:${bd.clazz.name} 方法:${md.name} Render 设置页面不存在`;
      this.sendType = 'html';
    }
  }

  private resolveReqPath(): string {
    const { bd, md } = this.option;
    const ctrParam = bd.getAnnotation(Controller)?.params as MappingParam;
    const ctrPath = ctrParam.path;
    if (isEmpty(ctrPath)) {
      this.error('resolveReqPath @Controller path not to be empty');
    }
    const ctrMiddleWare =
      (bd.getAnnotation(ApiMiddleWare)?.params as MiddleWareParam)
        ?.middleWareClassList || [];

    const mp = (
      md.getAnnotation(Get) ||
      md.getAnnotation(Post) ||
      md.getAnnotation(RequestMapping)
    )?.params as MappingParam;

    const mdPath = mp.path || md.name;

    const methodMiddleWare =
      (md.getAnnotation(MiddleWare)?.params as MiddleWareParam)
        ?.middleWareClassList || [];

    this.middleWareFunction = this.resolveMiddleWareFunction(
      ctrMiddleWare.concat(methodMiddleWare)
    );

    return path.join('/', ctrPath, mdPath).replace(/\\/g, `/`);
  }

  private resolvePamaterLength(): number {
    let i = 0;
    this.option.md.paramterDefineList.forEach(p => {
      i = Math.max(i, p.index);
    });
    return i + 1;
  }

  private resolveMiddleWareFunction(
    oriMiddleWare: middleWareType[]
  ): Function[] {
    const reuslt = oriMiddleWare.map(oriWare => {
      if (getBeanDefineByClass(oriWare as Clazz)) {
        const bean = assemble(oriWare as Clazz);
        const invoke = (bean as ExpressMiddleWare).invoke;
        invoke.bind(bean);
        return invoke;
      } else {
        return oriWare as Function;
      }
    });
    return reuslt;
  }

  async getInvokeParams(req: any, res: any): Promise<paramContainer[]> {
    const { md } = this.option;
    const params: paramContainer[] = [];

    //填充所有参数
    for (let i = 0; i < this.maxParamLength; i++)
      params.push({ bean: undefined, inteceptor: undefined });

    //每个字段匹配第一个可以处理的注解
    for (let pdi = 0; pdi < md.paramterDefineList.length; pdi++) {
      const paramterDefine = md.paramterDefineList[pdi];
      for (let ai = 0; ai < paramterDefine.annotationList.length; ai++) {
        const an: Anntation = paramterDefine.annotationList[ai];
        const pi = paramInterceptor.find(pi => pi.getAnnotation() === an.clazz);
        if (pi) {
          let bean;
          try {
            const tempBean = pi.getBean(req, res, an);
            bean = tempBean instanceof Promise ? await tempBean : tempBean;
          } catch (e) {
            //如果获取异常 则执行销毁
            params.forEach(p => p.inteceptor?.error(p.bean));
            throw e;
          }
          params[paramterDefine.index] = { bean, inteceptor: pi };
        }
      }
    }

    return params;
  }

  constructor(public option: MethodRouterParm) {
    const { md, bd } = option;
    this.index = option.index;
    this.hasShuttle = bd.hasAnnotation(Shuttle);
    this.hasGet = md.hasAnnotation(Get);
    this.hasPost = md.hasAnnotation(Post);
    this.hasRequestMapping = md.hasAnnotation(RequestMapping);
    this.invokeMethod = this.resolveInokeMethod();
    this.reqPath = this.resolveReqPath();
    this.maxParamLength = this.resolvePamaterLength();

    if (md.hasAnnotation(ApiRemark)) {
      this.apiRemark = `//${
        (md.getAnnotation(ApiRemark)?.params as ApiRemarkParam)?.remark
      }`;
    }
  }

  loadNormalApi(app: ExpressApp) {
    this.resolveSendType(app);
    const { md, bean, exceptionHandler } = this.option;
    const { invokeMethod, sendType, reqPath, middleWareFunction } = this;

    //代理的函数
    const proxyFunction = async (req: Request, res: Response) => {
      let params: paramContainer[] = []; //参数
      let result: any; //业务计算结果

      //统一错误处理
      const wrapHandler = (code: number, e: unknown) => {
        params.forEach(p => p.inteceptor?.error(p.bean));
        exceptionHandler().hanlder(req, res, {
          code,
          error: e as string,
          sendType,
        });
      };

      //1.处理参数反射阶段
      try {
        params = await this.getInvokeParams(req, res);
      } catch (e) {
        return wrapHandler(400, e);
      }

      try {
        //2.业务处理阶段
        const paramBeans = params.map(p => p.bean);
        result = await bean[md.name].apply(bean, paramBeans);

        if (result !== void 0) {
          //3.渲染阶段
          switch (sendType) {
            case 'json':
              res.json(result);
              break;
            case 'html':
              const filePath = md.getAnnotation(Render)?.params.path;
              res.render(`${filePath}`, result);
              break;
            default:
              wrapHandler(500, `sendType error:${sendType}`);
          }
        }

        params.forEach(p => p.inteceptor?.success(p.bean));
      } catch (e) {
        wrapHandler(500, e);
      }
    };

    //执行的方法
    const appMethod = (app as any)[invokeMethod];

    logger(
      `${this.index}: api ${invokeMethod} ${reqPath} => ${sendType} ${this.apiRemark}`
    );

    appMethod.apply(app, [reqPath, ...middleWareFunction, proxyFunction]);
  }

  /**
   * 只支持post请求，将body中的参数
   *
   */
  loadShuttleApi(app: ExpressApp) {
    const { md, bean, exceptionHandler } = this.option;
    const { reqPath, middleWareFunction } = this;

    const proxyFunction = async (req: Request, res: Response) => {
      if (req.body === void 0) {
        throw 'please use body-parse middleWare or add BodyParseConfiguration';
      }
      const { args } = req.body;
      try {
        const result = await bean[md.name].apply(bean, [...args, { req, res }]);
        res.json(result);
      } catch (e) {
        exceptionHandler().hanlder(req, res, {
          code: 500,
          sendType: 'POST',
          error: `[SHUTTILE] ${e}`,
        });
      }
    };

    logger(`${this.index}: shuttle post ${reqPath} => json ${this.apiRemark}`);

    (app as any).post(reqPath, [...middleWareFunction, proxyFunction]);
  }

  loadExpressApp(app: ExpressApp) {
    if (this.hasShuttle) {
      this.loadShuttleApi(app);
    } else {
      this.loadNormalApi(app);
    }
  }
}

const isEmpty = (str: string) => typeof str === 'string' && str === '';

function hasTargetAnnotation(md: MethodDefine) {
  return (
    md.hasAnnotation(Get) ||
    md.hasAnnotation(Post) ||
    md.hasAnnotation(RequestMapping)
  );
}

//controller配置
export class ControllerBeanConfiguration implements ExpressLoad {
  methodRouter: MethodRouter[] = [];

  constructor(
    public bean: any,
    public bd: BeanDefine,
    public exceptionHandler: () => SpringWebExceptionHandler
  ) {
    let i = 0;

    bd.methodList.filter(hasTargetAnnotation).forEach(md => {
      this.methodRouter.push(
        new MethodRouter({ index: ++i, bean, bd, md, exceptionHandler })
      );
    });
  }

  //加载express app
  load(_app: ExpressApp): void {
    //注册所有路由
    this.methodRouter.forEach(m => m.loadExpressApp(_app));
    //注册错误处理路由
    _app.use((err: any, req: Request, res: Response, next: Function) => {
      this.exceptionHandler().hanlder(
        req,
        res,
        { code: req.statusCode || 500, sendType: 'get', error: err },
        next
      );
    });
  }
}
