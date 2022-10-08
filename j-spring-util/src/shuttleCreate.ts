type ShuttleConfig = {
    host:string,
    request:{
      post:(url:string,data:any)=>Promise<any>
    },
    format?:(data:any)=>any
  }
  
  type ShuttleConfigAdd = {
    [p in keyof ShuttleConfig]?:ShuttleConfig[p]
  }
  
  const GlobalConfig:ShuttleConfigAdd = {
  }
  
  function validateConfig(config:ShuttleConfigAdd){
    if(!config.host){
        throw `[SHUTTLE] host must be set`
    }
    if(!config.request){
        throw `[SHUTTLE] request must be set`
    }
  }

  export function setConfig(config:ShuttleConfig){
    Object.assign(GlobalConfig,config);
  }

  export function createShuttle(controllerApi:string,diyOption?:ShuttleConfigAdd):any{

    //获取配置
    let config = {...GlobalConfig,...diyOption};
  
    //校验配置
    validateConfig(config);

    let proxy = new Proxy({},{
  
      get: function(_obj, prop) {
  
        const method = prop.toString();
  
        return  async function(...args:any[]){
  
            const url = `${config.host}/${controllerApi}/${method}`

            const reqResult = await config.request?.post(url,{args})

            if(reqResult.data && config.format){
                reqResult.data = config.format(reqResult.data)
            }

            return reqResult;
        }      
  
      }
  
    })
  
    return proxy;
  
  }