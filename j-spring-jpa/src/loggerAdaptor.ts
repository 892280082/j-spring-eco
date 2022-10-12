import { Logger, QueryRunner } from 'typeorm'
import { springLog } from 'j-spring'

function stringifyParams(parameters: any[]) {
    try {
        return JSON.stringify(parameters)
    } catch (error) {
        return parameters
    }
}

export class LoggerAdaptor implements Logger {
    logQuery(query: string, parameters?: any[] | undefined, _queryRunner?: QueryRunner | undefined) {
        const sql =
        query +
        (parameters && parameters.length
            ? " -- PARAMETERS: " + stringifyParams(parameters)
            : "")
        return springLog.debug(sql);
    }
    logQueryError(error: string | Error, query: string, parameters?: any[] | undefined, _queryRunner?: QueryRunner | undefined) {
        const sql =
        query +
        (parameters && parameters.length
            ? " -- PARAMETERS: " + stringifyParams(parameters)
            : "")
        springLog.error( `query failed:`+sql);
        if(error)
            springLog.error(error);
    }
    logQuerySlow(time: number, query: string, parameters?: any[] | undefined, _queryRunner?: QueryRunner | undefined) {
        const sql =
            query +
            (parameters && parameters.length
                ? " -- PARAMETERS: " + stringifyParams(parameters)
                : "")
        springLog.warn(`query is slow:`+sql)
        springLog.warn(`execution time:`+time)
    }
    logSchemaBuild(message: string, _queryRunner?: QueryRunner | undefined) {
        springLog.debug("SchemaBuild:"+message)
    }
    logMigration(message: string, _queryRunner?: QueryRunner | undefined) {
        springLog.debug(message);
    }
    log(level: 'warn' | 'info' | 'log', message: any, _queryRunner?: QueryRunner | undefined) {
        switch(level){
            case 'log':
                springLog.debug(message);
                break;
            case 'info':
                springLog.info(message);
                break;
            case 'warn':
                springLog.warn(message);
        }        
    }
}