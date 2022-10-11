import winston from 'winston';
import { ResourceOperate,Logger } from 'j-spring';
const { combine, timestamp, printf, colorize, align } = winston.format;

export function WinstonLog(resource:ResourceOperate):Logger{

  const {hasConfig,geFormatValue} = resource;

  const configLevel = geFormatValue('j-spring.log.level');

  const transports:winston.transport[] = [new winston.transports.Console()];

  //检查是否存在 日志文件 如果存在 添加配置
  const fileKey = 'j-spring.log.fileName';

  if(hasConfig(fileKey)){
    transports.push(new winston.transports.File({ filename: geFormatValue(fileKey) }))
  }

  const logger = winston.createLogger({
    level: configLevel,
    format: combine(
      colorize({ all: true }),
      timestamp({
        format: 'YYYY-MM-DD hh:mm:ss',
      }),
      align(),
      printf((info:any) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports
  });

  return logger;
}




