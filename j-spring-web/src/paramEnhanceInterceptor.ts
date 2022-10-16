/***
 * 请求参数增强
 * QueryParamEnhance 获取普通query增强
 * PathVariableEnhance 路径参数获取增强
 * ReflectParamEnhance 反射参数获取增强
 * SessionAttributeEnhance session参数获取曾强
 */

import { Anntation, ReflectParam, isFunctionList } from 'j-spring';
import {
  ArrayNumber,
  ArrayString,
  Request,
  Response,
  Session,
} from './springReflectType';
import {
  ParamterParamType,
  PathVariable,
  RequestParam,
  Param,
  SessionAttribute,
} from './springWebAnnotation';

//参数拦截操作操作
export interface ParamEnhanceInterceptor<T> {
  isParamEnhanceInterceptor(): boolean;

  //获取注解
  getAnnotation(): Function;

  //导出bean
  getBean(
    req: Request,
    res: Response,
    paramterAnnotation: Anntation
  ): Promise<T> | T;

  //业务执行出错  如何销毁bean
  error(bean: T): void;

  //业务执行成功
  success(bean: T): void;
}

export function isParamEnhanceInterceptor(
  bean: ParamEnhanceInterceptor<any>
): bean is ParamEnhanceInterceptor<any> {
  const t = bean as ParamEnhanceInterceptor<any>;
  return (
    t &&
    isFunctionList(
      t.getAnnotation,
      t.getBean,
      t.success,
      t.error,
      t.isParamEnhanceInterceptor
    ) &&
    t.isParamEnhanceInterceptor()
  );
}

//参数处理器集合
export const paramEnhanceInterceptorList: ParamEnhanceInterceptor<any>[] = [];

function simpleFormat(value: any, type: Function) {
  if (type === String) return '' + value;
  if (type === Number) return +value;
  if (type === Array) return Array.of(value);
  if (type === Boolean) {
    if (typeof value === 'string') {
      return value.toUpperCase() === 'TRUE';
    }
    return !!value;
  }
  return void 0;
}

function checkConvertValue(paramterName: string, value: any, type: Function) {
  if (value === void 0)
    throw `paramter:${paramterName} not support reflect type:${type}`;
  if (Number.isNaN(value)) throw `paramter:${paramterName} the value is Nan`;
}

//query拦截器
class QueryParamEnhance implements ParamEnhanceInterceptor<any> {
  getBean(req: Request, _res: Response, pa: Anntation) {
    const { name, force } = pa.params as ParamterParamType;
    const reflectType = (pa.params as ReflectParam).reflectType;
    const resutlt = req.query[name];
    if (resutlt === void 0 && !force) {
      return undefined;
    }
    if (resutlt === void 0 && force) {
      throw `paramter ${name} must be exist`;
    }
    if (reflectType === ArrayNumber)
      return resutlt.split(',').map((v: string) => +v);

    if (reflectType === ArrayString) return resutlt.split(',');

    const convertResult = simpleFormat(resutlt, reflectType);
    checkConvertValue(name, convertResult, reflectType);
    return convertResult;
  }
  error(_bean: any): void {}
  success(_bean: any): void {}
  isParamEnhanceInterceptor(): boolean {
    return true;
  }
  getAnnotation(): Function {
    return RequestParam;
  }
}

//params拦截器
class PathVariableEnhance implements ParamEnhanceInterceptor<any> {
  error(_bean: any): void {}
  success(_bean: any): void {}
  isParamEnhanceInterceptor(): boolean {
    return true;
  }
  getAnnotation(): Function {
    return PathVariable;
  }
  getBean(req: Request, _res: Response, pa: Anntation): Promise<any> | any {
    const { name } = pa.params as ParamterParamType;
    const reflectType = (pa.params as ReflectParam).reflectType;
    const resutlt = req.params[name];
    const convertResult = simpleFormat(resutlt, reflectType);
    checkConvertValue(name, convertResult, reflectType);
    return convertResult;
  }
}

class ReflectParamEnhance implements ParamEnhanceInterceptor<any> {
  error(_bean: any): void {}
  success(_bean: any): void {}
  isParamEnhanceInterceptor(): boolean {
    return true;
  }
  getAnnotation(): Function {
    return Param;
  }
  getBean(req: Request, res: Response, pa: Anntation) {
    const { reflectType } = pa.params as ReflectParam;
    if (reflectType === Request) return req;
    if (reflectType === Response) return res;
    if (reflectType === Session) {
      if (req.session === void 0) {
        throw '没有安装session插件';
      }
      return new Session(req.session);
    }
    throw `不支持参数反射类型: [${reflectType}]`;
  }
}

class SessionAttributeEnhance implements ParamEnhanceInterceptor<any> {
  error(_bean: any): void {}
  success(_bean: any): void {}
  isParamEnhanceInterceptor(): boolean {
    return true;
  }
  getAnnotation(): Function {
    return SessionAttribute;
  }
  getBean(req: any, _res: any, pa: Anntation) {
    if (!req.session) {
      throw 'not find session module';
    }
    const { name, force } = pa.params as ParamterParamType;
    const reflectType = (pa.params as ReflectParam).reflectType;
    const resutlt = req.session[name];
    if (resutlt === void 0 && !force) {
      return undefined;
    }
    if (resutlt === void 0 && force) {
      throw `session ${name} must be exist`;
    }
    const convertValue = simpleFormat(resutlt, reflectType);

    if (convertValue === void 0) {
      const pojo = new reflectType();
      Object.assign(pojo, resutlt);
      return pojo;
    }

    checkConvertValue(`session.${name}`, convertValue, reflectType);

    return convertValue;
  }
}

paramEnhanceInterceptorList.push(new QueryParamEnhance());
paramEnhanceInterceptorList.push(new PathVariableEnhance());
paramEnhanceInterceptorList.push(new ReflectParamEnhance());
paramEnhanceInterceptorList.push(new SessionAttributeEnhance());
