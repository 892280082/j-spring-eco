import winston from 'winston'


export function consoleLogger(){

    return winston.createLogger({
        level:"debug",
        transports: [
          new winston.transports.Console()
        ]
    })

}