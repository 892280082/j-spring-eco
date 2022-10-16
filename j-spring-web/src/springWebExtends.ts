import { ExpressApp, Request, Response } from './springReflectType';

export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function';

export interface ExpressLoad {
  load(app: ExpressApp): void;
}

//express App 配置
export interface ExpressConfiguration extends ExpressLoad {
  load(app: ExpressApp): void;
  isExpressConfiguration(): boolean;
}

export function isExpressConfiguration(bean: any) {
  const ec = bean as ExpressConfiguration;
  return (
    isFunction(ec.load) &&
    isFunction(ec.isExpressConfiguration) &&
    ec.isExpressConfiguration()
  );
}

//错误信息
export type errorInfo = {
  code: number;
  error: string;
  sendType: string;
};

//SpringWeb 异常处理
export interface SpringWebExceptionHandler {
  isSpringWebExceptionHandler(): boolean;

  //异常处理
  hanlder(
    req: Request,
    res: Response,
    errorInfo: errorInfo,
    next?: Function
  ): void;
}

export function isSpringWebExceptionHandler(bean: any): boolean {
  const t = bean as SpringWebExceptionHandler;
  return (
    t &&
    isFunction(t.hanlder) &&
    isFunction(t.isSpringWebExceptionHandler) &&
    t.isSpringWebExceptionHandler()
  );
}
