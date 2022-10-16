/**
 * 路由增强
 * 默认发送 application/json
 * RenderEnhance 处理页面请求
 * ShuttleEnhance 处理shuttle请求
 */

import { BeanDefine, isFunctionList, MethodDefine } from 'j-spring';
import { ExpressApp, Request, Response } from './springReflectType';
import { Render, Shuttle } from './springWebAnnotation';
import { existsSync } from 'fs';
import { MethodRouter } from './springWebRouterDelegate';

export const routeEnhanceInterceptor: RouterEnhanceInterceptor[] = [];

type BaseResultMetaParam = {
  app: ExpressApp;
  bd: BeanDefine;
  md: MethodDefine;
};

type BaseResultParam = {
  req: Request;
  res: Response;
  result: any;
};

type invokeProxyFunction = (req: Request, res: Response) => Promise<void>;

export interface RouterEnhanceInterceptor {
  isRouterEnhanceInterceptor(): boolean;
  match(option: BaseResultMetaParam): boolean;
  operate(option: BaseResultMetaParam & BaseResultParam): void;
  validate(option: BaseResultMetaParam): boolean;
  getReqType(option: BaseResultMetaParam): 'get' | 'post' | 'use';
  getSendType(option: BaseResultMetaParam): 'html' | 'json';
  getInvokeFunction(_router: MethodRouter): invokeProxyFunction | undefined;
}

export function isRouterEnhanceInterceptor(
  bean: RouterEnhanceInterceptor
): bean is RouterEnhanceInterceptor {
  return (
    bean &&
    isFunctionList(
      bean.isRouterEnhanceInterceptor,
      bean.match,
      bean.operate,
      bean.validate,
      bean.getReqType,
      bean.getSendType,
      bean.getInvokeFunction
    ) &&
    bean.isRouterEnhanceInterceptor()
  );
}

/***
 * render 处理器
 */
class RenderEnhance implements RouterEnhanceInterceptor {
  isRouterEnhanceInterceptor(): boolean {
    return true;
  }
  match(option: BaseResultMetaParam): boolean {
    return option.md.hasAnnotation(Render);
  }
  operate(option: BaseResultMetaParam & BaseResultParam): void {
    const { md, res, result } = option;
    const renderAnnotation = md.getAnnotation(Render);
    if (renderAnnotation) {
      const path = renderAnnotation.params.path;
      res.render(path, result);
    }
  }
  validate(option: BaseResultMetaParam): boolean {
    const { md, app, bd } = option;
    const renderAnnotation = md.getAnnotation(Render);
    if (renderAnnotation) {
      const path = renderAnnotation.params.path;
      if (path && !existsSync(path.join(app.get('views'), path)))
        throw `类:${bd.clazz.name} 方法:${md.name} Render 设置页面不存在`;
      return true;
    } else {
      return false;
    }
  }
  getReqType(_option: BaseResultMetaParam): 'get' | 'post' | 'use' {
    return 'get';
  }
  getSendType(_option: BaseResultMetaParam): 'html' | 'json' {
    return 'html';
  }
  getInvokeFunction(_router: MethodRouter): invokeProxyFunction | undefined {
    return void 0;
  }
}

class ShuttleEnhance implements RouterEnhanceInterceptor {
  isRouterEnhanceInterceptor(): boolean {
    return true;
  }
  match(option: BaseResultMetaParam): boolean {
    return option.bd.hasAnnotation(Shuttle);
  }
  operate(_option: BaseResultMetaParam & BaseResultParam): void {}
  validate(_option: BaseResultMetaParam): boolean {
    return true;
  }
  getReqType(_option: BaseResultMetaParam): 'get' | 'post' | 'use' {
    return 'post';
  }
  getSendType(_option: BaseResultMetaParam): 'html' | 'json' {
    return 'json';
  }
  getInvokeFunction(router: MethodRouter): invokeProxyFunction | undefined {
    const { md, bean, exceptionHandler } = router.option;
    return async (req: Request, res: Response) => {
      if (req.body === void 0) {
        throw '请添加body-parse解析中间件 或加载内置的BodyParseConfiguration';
      }
      const { args } = req.body;
      try {
        const result = await bean[md.name].apply(bean, [...args, { req, res }]);
        if (result !== void 0) res.json(result);
      } catch (e) {
        exceptionHandler().hanlder(req, res, {
          code: 500,
          sendType: 'POST',
          error: `[SHUTTILE] ${e}`,
        });
      }
    };
  }
}

routeEnhanceInterceptor.push(new RenderEnhance());
routeEnhanceInterceptor.push(new ShuttleEnhance());
