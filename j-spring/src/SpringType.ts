//定义空构造器
//export type Clazz = {new(...args:any[]):{}}

export type Clazz = new () => any;

export type AnnoParam = {
  [key: string]: any;
};

export type ReflectParam = {
  reflectType: any;
};

export class Anntation {
  constructor(remark: string, clazz: Function, _params?: AnnoParam) {
    this.remark = remark;
    this.clazz = clazz;
    if (_params) this.params = _params;
  }
  remark: String; //类名 字段名 方法名 参数名
  clazz: Function; //注解的构造器
  params: AnnoParam = {}; //注解参数
}

//基础元数据定义
class BaseDefine {
  constructor(name: string, annotatinList?: [Anntation]) {
    this.name = name;
    if (annotatinList) this.annotationList = annotatinList;
  }
  name: string;
  annotationList: Anntation[] = [];
  getAnnotation(clazz: Function): Anntation | undefined {
    return this.annotationList.find(a => a.clazz === clazz);
  }
  hasAnnotation(clazz: Function): boolean {
    return !!this.getAnnotation(clazz);
  }
}

//方法定义
export class MethodDefine extends BaseDefine {
  //参数列表（拥有注解的）
  paramterDefineList: ParamterDefine[] = [];
}

//字段定义
export class FieldDefine extends MethodDefine {}

//方法参数定义
export class ParamterDefine extends MethodDefine {
  constructor(name: string, index: number, annotatinList?: [Anntation]) {
    super(name, annotatinList);
    this.index = index;
  }
  index: number;
}

//bean定义
export class BeanDefine extends BaseDefine {
  constructor(clazz: Clazz, annotation?: Anntation) {
    super(clazz.toString());
    this.clazz = clazz;
    annotation && this.annotationList.push(annotation);
  }

  //类
  clazz: Clazz;

  //方法定义集合
  methodList: MethodDefine[] = [];

  //字段定义集合
  fieldList: FieldDefine[] = [];
}
