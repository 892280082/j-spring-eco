import { geFormatValue,loadResourceConfig } from './SpringResource'
import { isFunction } from './util/shared';

//设置默认配置
loadResourceConfig({
    'j-spring':{
        log:{
            level:'debug'
        }
    }
})

type LogCallback = (
    error?: any,
    level?: string,
    message?: string,
    meta?: any
) => void;


type LeveledLogMethod = {
    (message: string, callback: LogCallback): Logger;
    (message: string, meta: any, callback: LogCallback): Logger;
    (message: string, ...meta: any[]): Logger;
    (message: any): Logger;
    (infoObject: object): Logger;
}

export type Logger = {
    error: LeveledLogMethod;
    warn: LeveledLogMethod;
    help: LeveledLogMethod;
    data: LeveledLogMethod;
    info: LeveledLogMethod;
    debug: LeveledLogMethod;
    prompt: LeveledLogMethod;
    http: LeveledLogMethod;
    verbose: LeveledLogMethod;
    input: LeveledLogMethod;
    silly: LeveledLogMethod;
}


const isOpenLog = () => {
    return geFormatValue('j-spring.log.level',String) !== 'off';
}

let configLevel:string;
const levelDic = ['error','warn','help','data','info','debug','prompt','http','verbose','input','silly'];

const createMethod = (methodLevel:string)=>{

    return (arg:any):Logger=>{


        if(isOpenLog()){

            if(!configLevel)
                configLevel = geFormatValue('j-spring.log.level',String);
            
            if(configLevel.indexOf(methodLevel)>-1 || levelDic.indexOf(methodLevel)<=levelDic.indexOf(configLevel)){

                if(thridLog){
                    const m = (thridLog as any)[methodLevel];
                    if(isFunction(m)){
                        m.apply(thridLog,[arg])
                    }else{
                        throw `第三方日志不支持${methodLevel}方法`
                    }
                }else{
                    const m = (console as any)[methodLevel] || console.log;
                    m.apply(console,[`${methodLevel} => ${arg}`]);
                }
               
            }
                
        }

        return springLog;
    }
}

export let springLog:Logger = {
    error: createMethod('error'),
    warn: createMethod('warn'),
    help: createMethod('help'),
    data: createMethod('data'),
    info: createMethod('info'),
    debug: createMethod('debug'),
    prompt: createMethod('prompt'),
    http: createMethod('http'),
    verbose: createMethod('verbose'),
    input: createMethod('input'),
    silly: createMethod('silly'),
}

let thridLog:Logger;

export const setLogger = (log:Logger) => {
    if(isOpenLog())
        thridLog = log;
}


export const createDebugLogger = (prefix:string) => (msg:string) => {
    springLog.debug(prefix+msg)
}