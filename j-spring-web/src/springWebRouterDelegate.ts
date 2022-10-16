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
  middleWareType,
  Render,
  ApiRemark,
  ApiRemarkParam,
} from './springWebAnnotation';
import { ExpressLoad, SpringWebExceptionHandler } from './springWebExtends';
import {
  paramEnhanceInterceptorList,
  ParamEnhanceInterceptor,
} from './paramEnhanceInterceptor';
import {
  routeEnhanceInterceptor,
  RouterEnhanceInterceptor,
} from './routerEnhanceInterceptor';

const logger = createDebugLogger('WebRouteDelegate:');

type paramContainer = {
  Interceptor: ParamEnhanceInterceptor<any> | undefined;
  bean: any;
};

type MethodRouterParm = {
  index: number;
  bean: any;
  bd: BeanDefine;
  md: MethodDefine;
  exceptionHandler: () => SpringWebExceptionHandler;
};

export class MethodRouter {
  index: number;
  hasGet: boolean;
  hasPost: boolean;
  hasRequestMapping: boolean;
  invokeMethod: string; //get post use
  sendType: string = 'json'; // 默认都是发送json
  reqPath: string; //请求路径
  maxParamLength: number; //最大参数数量
  middleWareFunction: Function[]; //中间件函数
  apiRemark: string = ''; //备注
  routerEnhance: RouterEnhanceInterceptor;
  app: ExpressApp;

  error(msg: string) {
    throw new Error(
      `class:${this.option.bd.clazz} method:${this.option.md.name} router analysis error:${msg}`
    );
  }

  private resolveInokeMethod(): string {
    if (this.routerEnhance) {
      return this.routerEnhance.getReqType({ app: this.app, ...this.option });
    }
    if (this.hasRequestMapping) return 'use';
    if (this.hasGet && this.hasPost) return 'use';
    if (this.hasGet) return 'get';
    if (this.hasPost) return 'post';
    this.error('_resolveInokeMethod error');
    return '';
  }

  private resolveSendType(app: ExpressApp): void {
    if (this.routerEnhance)
      this.sendType = this.routerEnhance.getReqType({ app, ...this.option });
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

    //如果只函授Render注解，则mp不存在 必须加以判断
    const mdPath = mp?.path || md.name;

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
      params.push({ bean: undefined, Interceptor: undefined });

    //每个字段匹配第一个可以处理的注解
    for (let pdi = 0; pdi < md.paramterDefineList.length; pdi++) {
      const paramterDefine = md.paramterDefineList[pdi];
      for (let ai = 0; ai < paramterDefine.annotationList.length; ai++) {
        const an: Anntation = paramterDefine.annotationList[ai];
        const pi = paramEnhanceInterceptorList.find(
          pi => pi.getAnnotation() === an.clazz
        );
        if (pi) {
          let bean;
          try {
            const tempBean = pi.getBean(req, res, an);
            bean = tempBean instanceof Promise ? await tempBean : tempBean;
          } catch (e) {
            //如果获取异常 则执行销毁
            params.forEach(p => p.Interceptor?.error(p.bean));
            throw e;
          }
          params[paramterDefine.index] = { bean, Interceptor: pi };
        }
      }
    }

    return params;
  }

  constructor(public option: MethodRouterParm) {
    const { app } = this;
    const { md, bd } = option;

    //寻找匹配的路由增强处理器
    const ro = routeEnhanceInterceptor.find(ro => ro.match({ app, bd, md }));
    if (ro) {
      this.routerEnhance = ro;
    }

    this.index = option.index;
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
    const { bd, md, bean, exceptionHandler } = this.option;
    const { invokeMethod, sendType, reqPath, middleWareFunction } = this;

    //默认的代理的函数
    const defaultProxyFunction = async (req: Request, res: Response) => {
      let params: paramContainer[] = []; //参数
      let result: any; //业务计算结果

      //统一错误处理
      const wrapHandler = (code: number, e: unknown) => {
        params.forEach(p => p.Interceptor?.error(p.bean));
        exceptionHandler().hanlder(req, res, {
          code,
          error: e as string,
          sendType,
        });
      };

      //1.使用参数增强 获取处理后的参数结果集合
      try {
        params = await this.getInvokeParams(req, res);
      } catch (e) {
        return wrapHandler(400, e);
      }

      try {
        //2.业务处理阶段
        const paramBeans = params.map(p => p.bean);
        result = await bean[md.name].apply(bean, paramBeans);

        //3.如果存在路由增强处理器 使用处理器处理 否则默认发送json数据
        this.routerEnhance
          ? this.routerEnhance.operate({ app, bd, md, req, res, result })
          : res.json(result);

        params.forEach(p => p.Interceptor?.success(p.bean));
      } catch (e) {
        wrapHandler(500, e);
      }
    };

    const invokeFunction =
      this.routerEnhance?.getInvokeFunction(this) || defaultProxyFunction;

    //执行的方法
    const appMethod = (app as any)[invokeMethod];

    logger(
      `${
        this.routerEnhance
          ? ` 路由增强：${(this.routerEnhance as any).constructor?.name} `
          : ''
      }  ${this.index}: api ${invokeMethod} ${reqPath} => ${sendType} ${
        this.apiRemark
      }`
    );

    appMethod.apply(app, [reqPath, ...middleWareFunction, invokeFunction]);
  }

  loadExpressApp(app: ExpressApp) {
    this.app = app;
    this.loadNormalApi(app);
  }
}

const isEmpty = (str: string) => typeof str === 'string' && str === '';

function hasTargetAnnotation(md: MethodDefine) {
  return (
    md.hasAnnotation(Get) ||
    md.hasAnnotation(Post) ||
    md.hasAnnotation(RequestMapping) ||
    md.hasAnnotation(Render)
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
  load(app: ExpressApp): void {
    //注册所有路由
    this.methodRouter.forEach(m => m.loadExpressApp(app));
    //注册错误处理路由
    app.use((err: any, req: Request, res: Response, next: Function) => {
      this.exceptionHandler().hanlder(
        req,
        res,
        { code: req.statusCode || 500, sendType: 'get', error: err },
        next
      );
    });
  }
}
