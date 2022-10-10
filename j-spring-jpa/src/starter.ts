import {  SpringStarter,SpringContainer, Clazz,Component, Value  } from 'j-spring'
import { ClazzExtendsMap } from 'j-spring/dist/SpringFactry';
import { DataSource, DataSourceOptions } from 'typeorm'

const entityList:any[]= [];

export function loadEntity(entities:any[]):void{
    entities.forEach(e => entityList.push(e))
} 

abstract class BaseDataSourceConnect extends SpringContainer implements SpringStarter {
    async doStart(clazzMap: ClazzExtendsMap): Promise<any> {
        const options = this.getOptions();

        const dataSource = new DataSource(options)

        await dataSource.initialize();

        clazzMap.addBean(DataSource as Clazz,dataSource,"typeorm数据配置-DataSource")
    }
    isSpringStater(): boolean {
        return true;
    }
    abstract getOptions():DataSourceOptions;
    

}

const sqliteOptionsPrefx = 'j-spring-jpa.sqlite'

@Component()
export class SqliteStarter extends BaseDataSourceConnect {

    @Value({path:`${sqliteOptionsPrefx}.name`,force:false })
    name:string = 'sqlite';

    @Value({path:`${sqliteOptionsPrefx}.database`,force:false})
    database:string = './data.db';

    @Value({path:`${sqliteOptionsPrefx}.logging`,force:false})
    logging:boolean = true;

    @Value({path:`${sqliteOptionsPrefx}.synchronize`,force:false})
    synchronize:boolean = true;

    getOptions(): DataSourceOptions {
        const {name,database,logging,synchronize} = this;
        const options: DataSourceOptions = {
            name,
            type: "sqlite",
            database,
            logging,
            synchronize,
            entities:entityList
        }
        return options;
    }

}