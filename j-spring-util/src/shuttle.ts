const globalOptions:any ={
  
}

export type ShuttleConfig = {
    host:string,
    request:{
        post:(url:string,data:any)=>Promise<any>
    }
}

export function setShuttleConfig(option:ShuttleConfig){
    Object.assign(globalOptions,option);
}

function validateConfig(option:ShuttleConfig){
    if(!option.host){
        throw `[SHUTTLE] host must be set`
    }
    if(!option.request){
        throw `[SHUTTLE] request must be set`
    }
}

export function createShuttle(controllerApi:string,diyOption?:ShuttleConfig):any{

    //获取配置
    let config:ShuttleConfig = {...globalOptions,...(diyOption || {})};

    //校验配置
    validateConfig(config);
  
    let proxy = new Proxy({},{

      get: function(_obj, prop) {

        const method = prop.toString();

        return function(...args:any[]){

          const url = `${config.host}/${controllerApi}/${method}`
          
          return config.request.post(url,{args})
  
        }      

      }

    })
  
    return proxy;
  
  }