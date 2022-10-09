import { isCanFormat,doForamtPlainValue } from './util/formatValue'

//初始化配置文件
let configMap = new Map<string,any>();

//加载配置
export const loadResourceConfig = function(data:any,prefixKey?:string){
    
    prefixKey = prefixKey ? `${prefixKey}.` : '';

    for(let key of Object.keys(data)){

        const value = data[key];
        const setKey = prefixKey+key;

        if(typeof value === 'object'){
            loadResourceConfig(value,setKey)
        }else{
            configMap.set(setKey,value)
        }

    }

}

//获取配置信息
export const getConfigMap = ()=>configMap;

//是否存在指定配置
export const hasConfig = (key:string):boolean => configMap.has(key);

//验证配置
export const validateType = (type:Function) => isCanFormat(type);


const throwError = (path:string,msg:string):void => { throw Error(`[SPRING_RESOURCE_ERROR: path[${path}] reason[${msg}] `) };


//格式化值
export const geFormatValue = (key:string,type:Function) => {

    if(!hasConfig(key)){
        throwError(key,'not find')
    }

    const value = configMap.get(key);

    try{
        const formatValue = doForamtPlainValue(value,type);
        return formatValue;
    }catch(e){
        return throwError(key,''+e)
    }
}