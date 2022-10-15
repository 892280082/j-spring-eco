import { Anntation, ReflectParam } from 'j-spring';
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
import { SpringWebParamInteceptor } from './springWebExtends';

//参数处理器集合
export const paramInterceptor: SpringWebParamInteceptor<any>[] = [];

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
class RequestParamParamInteceptor implements SpringWebParamInteceptor<any> {
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
  isSpringWebParamInteceptor(): boolean {
    return true;
  }
  getAnnotation(): Function {
    return RequestParam;
  }
}

//params拦截器
class PathVariableParamInteceptor implements SpringWebParamInteceptor<any> {
  error(_bean: any): void {}
  success(_bean: any): void {}
  isSpringWebParamInteceptor(): boolean {
    return true;
  }
  getAnnotation(): Function {
    return PathVariable;
  }
  getBean(req: Request, _res: Response, pa: Anntation): Promise<any> | any {
    const { name } = pa.params as ParamterParamType;
    const reflectType = (pa.params as ReflectParam).reflectType;
    const resutlt = req.query[name];
    const convertResult = simpleFormat(resutlt, reflectType);
    checkConvertValue(name, convertResult, reflectType);
    return convertResult;
  }
}

class ParamInteceptor implements SpringWebParamInteceptor<any> {
  error(_bean: any): void {}
  success(_bean: any): void {}
  isSpringWebParamInteceptor(): boolean {
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

class SessionAttributeInteceptor implements SpringWebParamInteceptor<any> {
  error(_bean: any): void {}
  success(_bean: any): void {}
  isSpringWebParamInteceptor(): boolean {
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

paramInterceptor.push(new RequestParamParamInteceptor());
paramInterceptor.push(new PathVariableParamInteceptor());
paramInterceptor.push(new ParamInteceptor());
paramInterceptor.push(new SessionAttributeInteceptor());
