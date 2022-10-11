import { geFormatValue,loadResourceConfig } from './SpringResource'

//设置默认配置
loadResourceConfig({
    'j-spring':{
        on:{
            state:'on',
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
    return geFormatValue('j-spring.log.state',String) !== 'off';
}

const createMethod = (methodLevel:string)=>{

    return (...args:any[]):Logger=>{


        if(isOpenLog()){

            const configLevel = geFormatValue('j-spring.log.level',String);
            const levelDic = ['error','warn','help','data','info','debug','prompt','http','verbose','input','silly'];

            const configLevelIndex = levelDic.indexOf(configLevel);
            const methodLevelIndex = levelDic.indexOf(methodLevel);
            const m = (console as any)[methodLevel] || console.log;

            if(methodLevelIndex<=configLevelIndex && m){
                m.apply(console,[`${methodLevel} => `,...args]);
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


export const setLogger = (log:Logger) => {
    if(isOpenLog())
        springLog = log;
}


export const createDebugLogger = (prefix:string) => (msg:string) => {
    springLog.debug(prefix+msg)
}