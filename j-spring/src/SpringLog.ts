import { geFormatValue,hasConfig } from './SpringResource'

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

type Logger = {
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


const createMethod = (methodLevel:string)=>{

    return (...args:any[]):Logger=>{

        const openState = hasConfig('j-spring.log.state') ? ''+geFormatValue('j-spring.log.state',String) : 'on';

        if(openState === 'on'){

            const configLevel = hasConfig('j-spring.log.level') ? ''+geFormatValue('j-spring.log.level',String) : 'info';
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

export type LoadLoggerType = {
    load(has:(key:string)=>boolean,format:(key:string)=>string):Logger
}

export const loadLogger = (thirdModule:LoadLoggerType):void => {
    const formatStr = (key:string) => ''+geFormatValue(key,String); 
    springLog = thirdModule.load(hasConfig,formatStr);
}

export const createDebugLogger = (prefix:string) => (...data:any[]) => {
    const m:Function = springLog.debug;
    m.apply(springLog,[prefix,...data]);
}