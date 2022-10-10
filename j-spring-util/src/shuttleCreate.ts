type ShuttleConfig = {
  host: string,
  request: {
    post: (url: string, data: any) => Promise<any>
  },
  format: (data: any) => any
}

const GlobalConfig: Partial<ShuttleConfig> = {
  format: (result: any) => result.data
}

function isValidateConfig(config: Partial<ShuttleConfig>): config is ShuttleConfig {
  if (!config.host) {
    throw `[SHUTTLE] host must be set`
  }
  if (!config.request) {
    throw `[SHUTTLE] request must be set`
  }
  return true;
}

export function setConfig(config: ShuttleConfig) {
  Object.assign(GlobalConfig, config);
}

export function createShuttle(controllerApi: string, diyOption?: Partial<ShuttleConfig>): any {

  //获取配置
  let config = { ...GlobalConfig, ...diyOption };

  if (isValidateConfig(config)) {

    let c:ShuttleConfig = config;

    let proxy = new Proxy({}, {

      get: function (_obj, prop) {

        const method = prop.toString();

        return async function (...args: any[]) {

          const url = `${config.host}/${controllerApi}/${method}`

          const reqResult = await c.request.post(url, { args })

          const finalResult = c.format(reqResult);

          return finalResult;
        }

      }

    })

    return proxy;

  }


}