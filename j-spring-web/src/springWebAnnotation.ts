import { spring } from 'j-spring';

export type middleWareType =
  | ((req: any, res: any, next: () => void) => void)
  | (new () => ExpressMiddleWare);

export type MiddleWareParam = {
  middleWareClassList: middleWareType[];
};

export type MappingParam = {
  path: string;
};

export const Controller = (path: string) =>
  spring.classAnnotationGenerator(
    'j-spring-web.Controller',
    { path },
    Controller
  );

export const Shuttle = () =>
  spring.classAnnotationGenerator('j-spring-web.Shuttle', {}, Shuttle);

export const ApiMiddleWare = (middleWareClassList: middleWareType[]) =>
  spring.classAnnotationGenerator(
    'j-spring-web.ApiMiddleWare',
    { middleWareClassList },
    ApiMiddleWare
  );

//类 发送json控制器
//export const Json = ()=> spring.classAnnotationGenerator('j-spring-web.Json',{},Json);

//方法控制器 get请求

export const Get = (path?: string) =>
  spring.methodAnnotationGenerator('j-spring-web.Get', { path }, Get);

export type ApiRemarkParam = {
  remark: String;
};

export const ApiRemark = (remark: string) =>
  spring.methodAnnotationGenerator(
    'j-spring-web.Get',
    { remark } as ApiRemarkParam,
    ApiRemark
  );

//export const ResponseBody = () => spring.methodAnnotationGenerator('j-spring-web.ResponseBody',{},ResponseBody);

//方法控制器 Post请求

export const Post = (path?: string) =>
  spring.methodAnnotationGenerator('j-spring-web.Post', { path }, Post);

//方法控制器 RequestMapping

export const RequestMapping = (path?: string) =>
  spring.methodAnnotationGenerator(
    'j-spring-web.RequestMapping',
    { path },
    RequestMapping
  );

export const Render = (path?: string) =>
  spring.methodAnnotationGenerator('j-spring-web.Render', { path }, Render);

export const MiddleWare = (middleWareClassList: middleWareType[]) =>
  spring.methodAnnotationGenerator(
    'j-spring-web.middleWareClassList',
    { middleWareClassList },
    MiddleWare
  );

export type ParamterParamType = {
  name: string;
  force: boolean;
};

//express中间件
export interface ExpressMiddleWare {
  isExpressMidldleWare(): boolean;
  invoke(req: any, res: any, next: Function): void;
}

//字段
export const PathVariable = (name: string) =>
  spring.paramterAnnotationGenerator(
    'j-spring-web.PathVariable',
    name,
    { name },
    PathVariable
  );
//字段

export const RequestParam = (name: string, force?: false) =>
  spring.paramterAnnotationGenerator(
    'j-spring-web.RequestParam',
    name,
    { name, force: force === void 0 ? true : force },
    RequestParam
  );

export const RequestBody = (name: string) =>
  spring.paramterAnnotationGenerator(
    'j-spring-web.RequestBody',
    name,
    {},
    RequestBody
  );

//获取session
export const SessionAttribute = (name: string, force?: false) =>
  spring.paramterAnnotationGenerator(
    'j-spring-web.SessionAttribute',
    name,
    { name, force: force === void 0 ? true : force },
    SessionAttribute
  );

//获取反射参数
export const Param = () =>
  spring.paramterAnnotationGenerator(
    'j-spring-web.SessionAttribute',
    '',
    {},
    Param
  );
