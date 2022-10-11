import { Anntation, BeanDefine, Clazz, FieldDefine, ReflectParam } from './SpringType'
import { Autowired, AutowiredParam, Value, ValueParam } from './SpringAnnotation'
import { geFormatValue, hasConfig } from './SpringResource'
import { isFunction } from './util/shared';
import { isSpringFactoryBean, loadFactoryBean, SpringFactoryBean } from './SpringFactoryBean'
import { createDebugLogger,springLog } from './SpringLog'

const logger = createDebugLogger('SpringFactory:')


//对象缓存
const beanDefineMap = new Map<BeanDefine, any>()

//后置处理器集合
const beanPostProcessorList = new Set<BeanPostProcessor>();

//装配中的类 防止循环引用
const assembleingClass = new Set<Clazz>();

//额外绑定的class，防止类信息被treeshake掉
const bindBeanClazzList = new Set<Clazz>();

//实例化的启动的bean
export const starterBeanList = new Set<SpringStarter>();

//绑定的beanProcessor class
const bindBeanProcessorClazzList = new Set<new () => BeanPostProcessor>();

//bean定义集合
export const beanDefineList = new Set<BeanDefine>([]);

//id映射
export const idBeanDefineMap = new Map<string, BeanDefine>()

type LazyAutowired = {
    clazz?: Clazz;
    type?: (bean: any) => boolean;
    force: boolean
    bd: BeanDefine
    fieldBd: FieldDefine
    state: number //0 为装配 1默认值 2已经装配
}

//追加的的class和bean的映射
export const extendClazzBeanMap = new Map<Clazz, any>();

let lazyAutowiredList: LazyAutowired[] = [];

//bean的生命周期函数
export interface SpringBean {
    // [SpringEnum.__isPringBean__]:true
    //当属性装配完毕
    onAttrMounted(): void;
}

export type SpringStarterClazz = new () => SpringStarter;

export interface SpringStarter {
    isSpringStater(): boolean;
    //启动
    doStart(clazzMap: ClazzExtendsMap): Promise<any>;
}

export type ClazzExtendsMap = {
    addBean: (clazz: Clazz, bean: any, remark?: string) => void
}


//bean的后置处理器 用来做AOP
export interface BeanPostProcessor {

    //获取序号
    getSort(): number;

    //属性装配之前
    postProcessBeforeInitialization(bean: any, beanDefine: BeanDefine): Object

    //属性装配之后
    postProcessAfterInitialization(bean: any, beanDefine: BeanDefine): Object

}

function isSpringStarter(starter: SpringStarter): boolean {
    return starter && isFunction(starter.doStart) && isFunction(starter.isSpringStater) && starter?.isSpringStater();
}

function isBeanPostProcessorClass(clazz: Clazz): boolean {
    const post = new clazz() as BeanPostProcessor
    return isFunction(post.getSort) && isFunction(post.postProcessAfterInitialization) && isFunction(post.postProcessBeforeInitialization);
}

//根据类获取定义
export const getBeanDefineByClass = function (clazz: Clazz): BeanDefine | undefined {
    return Array.from(beanDefineList).find(b => b.clazz == clazz);
}

//替换类
export function replaceClazz<T, E extends T>(clazz: new () => T, target: new () => E): number {

    const fieldDefineList: FieldDefine[] = Array.from(beanDefineList).map(bd => bd.fieldList).reduce((s, v) => s.concat(v), []);
    const allFieldAnnotation: Anntation[] = fieldDefineList.map(f => f.annotationList).reduce((s, v) => s.concat(v), []);

    const matchAnnotation = allFieldAnnotation.filter(a => a.clazz === Autowired).filter(a => (a.params as AutowiredParam<any>).clazz == clazz)

    if (matchAnnotation.length == 0)
        throw Error(`[ReplaceClazzError] not match class ${clazz}`)

    matchAnnotation.forEach(a => (a.params as AutowiredParam<any>).clazz = target)

    return matchAnnotation.length;

}

//根据bean获取定义
export const getBeanDefineByBean = function (bean: any): BeanDefine | null {

    let bd: BeanDefine | null = null;

    beanDefineMap.forEach((mapBean, mapBd) => {

        if (mapBean === bean)
            bd = mapBd;

    })

    return bd;
}

//spring上下文
export abstract class SpringContainer {
    getBeanDefineMap() {
        return beanDefineMap;
    }
    getBeanPostProcessor() {
        return getSoredBeanPostProcessorList()
    }
}

//检测是否装配结束
function isAssembleComplete() {
    return assembleingClass.size === 0;
}

//根据类型装配
export function assemblelazyAutowiredList() {

    //获取需要装配的类
    const needAutowiredList = lazyAutowiredList.filter(a => a.state < 2);

    logger(`延迟装配总量:${needAutowiredList.length}`)

    let getCount = 1;//命中数量

    // 将beanMap（Component注解装配）中的按需装配给type
    // 将extendBean（SpringStarter手动装配的）按需装配给clazz 和 type
    if (needAutowiredList.length > 0) {

        const allBeans = Array.from(beanDefineMap.values());

        const extAllBeans = Array.from(extendClazzBeanMap.values());

        needAutowiredList.forEach(at => {

            const { bd, force, type, clazz, fieldBd } = at;

            //被装配的bean
            const selfBean = beanDefineMap.get(bd);

            let findBean: any;

            if (type) {

                findBean = allBeans.concat(extAllBeans).map(bean => {
                    if (isSpringFactoryBean(bean)) {
                        return (bean as SpringFactoryBean<any>).getBean();
                    }
                    return bean;
                }).filter(b => !!b).find(type);

            } else if (clazz) {
                if (extendClazzBeanMap.has(clazz)) {
                    findBean = extendClazzBeanMap.get(clazz);
                }
            } 

            if (findBean) {

                //如果匹配的bean是一个函数 则调用反射机制
                if (isFunction(findBean)) {
                    Object.defineProperty(selfBean, fieldBd.name, {
                        get() {
                            return findBean();
                        }
                    })
                } else {
                    //普通对象则直接注入
                    Reflect.set(selfBean, fieldBd.name, findBean);
                }

                logger(`序号:${getCount++} 延迟装配 [命中] 类：${clazz?.name} 字段：${fieldBd.name}`)

                //装配成功
                at.state = 2;

            } else {

                if (!force && selfBean[fieldBd.name] !== void 0) {
                    //非强制状态 并且拥有默认值
                    at.state = 1;
                    logger(`序号:${getCount++} 延迟装配 [默认值] 类:${bd.clazz.name} 字段：${fieldBd.name}`)
                }
            }

        })

    }






}

//如果未装配成功 则打印错误信息 退出程序 用于装配末尾执行
export function validateassemblelazyAutowiredListIsSuccess() {
    const needAutowiredList = lazyAutowiredList.filter(a => a.state === 0);
    if (needAutowiredList.length > 0) {

        const infos = needAutowiredList.reduce((s, at) => {
            return s + `class ${at.bd.clazz} field:${at.fieldBd.name} autowired by type error.not match.`
        }, '')

        logger('装配出错：存在未命中的延迟装配')

        throw (infos)
    }
}

//调用springBean的生命周期方法
function invokeSpringBeanMethod() {
    const allBeans = Array.from(beanDefineMap.values())
    allBeans.forEach(bean => (bean as SpringBean).onAttrMounted?.())
}

//装配指定class
export const assemble = function (clazz: Clazz) {

    logger(`装配类:${clazz.name}`)

    const bd = getBeanDefineByClass(clazz)

    if (!bd) {
        throw Error(`找不到类:[${clazz.name}]的BeanDefine信息,是否忘记在该类上添加 @Component() 装饰器?`)
    }

    const app = assembleBeanDefine(bd);

    //整体装配结束后
    if (isAssembleComplete()) {
        assemblelazyAutowiredList();
        invokeSpringBeanMethod();
    }

    return app;
}


//获取排序好的后指处理器
function getSoredBeanPostProcessorList(): BeanPostProcessor[] {
    return Array.from(beanPostProcessorList).sort((v1, v2) => v1.getSort() - v2.getSort());
}

//装配指定beanDefine
function assembleBeanDefine(bd: BeanDefine): any {

    if (beanDefineMap.has(bd)) {
        logger(`<= 返回缓存`)
        return beanDefineMap.get(bd);
    }

    //防止循环引用 加入装配记录
    if (assembleingClass.has(bd.clazz))
        throw Error(`类:[${bd.clazz.name}]未装配结束,请检查是否存在循环引用!`)

    assembleingClass.add(bd.clazz);

    //实例化对象 只支持无参构造器
    let bean = new bd.clazz();

    //获取后置处理器
    const beanPostProcessor = getSoredBeanPostProcessorList()

    //bean处理器处理装配前操作
    beanPostProcessor.forEach(post => bean = post.postProcessBeforeInitialization(bean, bd))

    //字段属性装配和注入
    bd.fieldList.forEach(fieldBd => {

        const fieldName = fieldBd.name;
        fieldBd.annotationList.forEach(anno => {

            //处理装配 依据class类型
            if (anno.clazz === Autowired) {
                const param = anno.params as AutowiredParam<Clazz>;
                const { force, type } = param;
                let { clazz } = param;
                let subApp;

                //依据类型推断进行装配
                if (type) {
                    lazyAutowiredList.push({
                        type,
                        force: !!force,
                        bd,
                        fieldBd,
                        state: 0
                    })
                    logger(`${bd.clazz.name} <= @Autowired[延迟] type:${type.name}`)
                    return;
                }

                clazz = clazz || (param as ReflectParam).reflectType;

                if (clazz) {
                    const subBeanDefine = getBeanDefineByClass(clazz)
                    if (subBeanDefine) {
                        logger(`${bd.clazz.name} <= @Autowired  class:${clazz.name}`)
                        subApp = assembleBeanDefine(subBeanDefine);
                    } else {
                        lazyAutowiredList.push({
                            clazz,
                            force: !!force,
                            bd,
                            fieldBd,
                            state: 0
                        })
                        logger(`${bd.clazz.name} <= @Autowired[延迟] class:${clazz.name}`)
                        return;
                    }

                }

                if (subApp) {
                    //如果是工厂bean
                    if (isSpringFactoryBean(subApp)) {
                        //使用工厂导入
                        loadFactoryBean(bean, fieldName, subApp)
                    } else { //普通bean
                        // const subApp = assemble(param.clazz);
                        if (!Reflect.set(bean, fieldName, subApp)) {
                            throw Error(`[反射装配错误] 类:${clazz?.name} 字段:${fieldName}`)
                        }
                    }
                }

            }

            //处理属性注入
            if (anno.clazz === Value) {
                const param = anno.params as ValueParam;

                //如果不是强制赋值 并且没有配置参数
                if (!param.force && !hasConfig(param.path)) {

                    if (bean[fieldName] === void 0) {
                        throw Error(`类:[${bd.clazz.name}] 字段:${fieldName} 若无配置则必须设置默认值!`)
                    }

                    logger(`${bd.clazz.name} <= @Value[默认值] 字段：${fieldName} 路径:${param.path} 值:${bean[fieldName]} `)

                } else {
                    const value = geFormatValue(param.path, (anno.params as ReflectParam).reflectType);
                    if (!Reflect.set(bean, fieldName, value)) {
                        throw Error(`[反射装配错误] 类:${bd.clazz.name} 字段:${fieldName}`)
                    }
                    logger(`${bd.clazz.name} <= @Value[配置] 字段：${fieldName} 路径:${param.path}  值:${value} `)
                }


            }
        })
    });

    //bean处理器处理装配后操作
    beanPostProcessor.forEach(post => bean = post.postProcessAfterInitialization(bean, bd))

    if (isSpringStarter(bean)) {
        starterBeanList.add(bean);
        logger(`${bd.clazz.name} 装入启动器 目前数量:${starterBeanList.size}`)
    }

    //删除引用
    assembleingClass.delete(bd.clazz);

    beanDefineMap.set(bd, bean);

    return bean;
}

//清空工厂的引用 主要测试使用
export const cleanBeanCache = () => {

    beanDefineMap.clear();

    starterBeanList.clear();

    lazyAutowiredList = [];

}

//绑定额外的class
export const addExtBeanClazz = (clazz: Clazz) => {

    if (isBeanPostProcessorClass(clazz)) {
        bindBeanProcessorClazzList.add(clazz)
    } else {
        bindBeanClazzList.add(clazz);
    }

}



//实例化所有额外的class
const instanceExtClazz = () => {
    logger('实例化其它class。 数量：' + bindBeanClazzList.size + ' (2/2)');
    let index = 1;
    Array.from(bindBeanClazzList).forEach(clazz => {
        logger(`进度:(${index++}/${bindBeanClazzList.size}) `)
        assemble(clazz);
    });
}

//实例化后置处理器
const instanceBeanPostProcessor = () => {
    logger('实例化后置处理器。 数量：' + bindBeanProcessorClazzList.size + ' (1/2) ')
    let index = 1;
    Array.from(bindBeanProcessorClazzList).map(clazz => {
        logger(`进度:(${index++}/${bindBeanProcessorClazzList.size})`)
        return assemble(clazz);
    }).forEach(b => beanPostProcessorList.add(b))

    //打印后置处理器执行顺序
    if(bindBeanProcessorClazzList.size>0){
        let sortIndex =1;
        logger('后置处理器执行顺序:')
        getSoredBeanPostProcessorList().forEach(p => {
            const bd = getBeanDefineByBean(p);
            if(bd){
                logger(`${sortIndex++}、类： ${bd.clazz.name} sort:${p.getSort()} `);
            }
        })
    }
}

//装配bean
export function getBean<T>(clazz: new () => T): T {
    beanFactoryInit();
    const b = assemble(clazz);
    validateassemblelazyAutowiredListIsSuccess();
    return b;
}

export function getBeanFromContainer<T>(clazz: new () => T): T | undefined {
    const bd = getBeanDefineByClass(clazz);
    if (bd) {
        return beanDefineMap.get(bd);
    } else {
        return extendClazzBeanMap.get(clazz);
    }
}

function printConfig(){
    
    let index = 1;

    //警告配置
    const warnings:string[] = [];

    beanDefineList.forEach(bd => {

        const fdList = bd.fieldList.filter(f => f.hasAnnotation(Value))
       
        if(fdList.length>0){

            logger(`${index++} 配置类:${ bd.clazz.name }`)

            const bean = new bd.clazz();

            fdList.forEach(fd => {

                const param = fd.getAnnotation(Value)?.params as ValueParam;

                const remark = param.remark ? param.remark : '无';

                const defaultValue = bean[fd.name] === undefined ? '无' : bean[fd.name];
                
                const configValue = hasConfig(param.path) ? geFormatValue(param.path,String) : '无'

                const printMsg = `路径:${param.path}  备注:${remark} 值:${configValue}  强制:${param.force ? '是':'否'}  默认值:${defaultValue}`;

                //1.强制复制 2.没有默认值 3.没有配置
                if(param.force && bean[fd.name] === void 0 && !hasConfig(param.path))
                    warnings.push(printMsg);

                logger(printMsg)

            })

        }

    })

    if(warnings.length > 0){
        springLog.warn('SpringFactory:------------- 存在问题的配置 -----------------')
        let i=1;
        warnings.forEach(msg => {
            springLog.warn(`${i++}:${msg}`)
        });
    }
    
}

export const beanFactoryInit = () => {

    logger(`阶段一-------------检查打印所有配置项----------------------`)
    logger(`内置:j-spring.log.on     备注:开启日志 值:on|off 强制：否 默认值:on `)
    logger(`内置:j-spring.log.level  备注:日志级别 值:根据加载插件 强制：否 默认值:debug `)
    logger(`内置:j-spring.log.fileName  备注:winston日志输出文件 值:否 强制：否 默认值:无 `)
    printConfig();

    logger('阶段二-------------------工厂初始化----------------------')

    //1.首先实例化后置处理器
    instanceBeanPostProcessor();

    //2.实例化额外绑定的类
    instanceExtClazz();

    logger('工厂初始化结束')

}