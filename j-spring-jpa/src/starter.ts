import {  SpringStarter,SpringContainer, Clazz,Component, Value  } from 'j-spring'
import { DataSource, DataSourceOptions } from 'typeorm'
import { Table } from './annotation'


abstract class BaseDataSourceConnect extends SpringContainer implements SpringStarter {
    isSpringStater(): boolean {
        return true;
    }
    abstract getOptions(entities:Function[]):DataSourceOptions;
    
    async doStart(clazzMap: Map<Clazz, any>): Promise<any> {

        const entities:Function[] = [];

        this.getBeanDefineMap().forEach( (_bean,bd) => {

            if(bd.hasAnnotation(Table)){
                entities.push(bd.clazz)
            }

        })

        const options = this.getOptions(entities);

        const dataSource = new DataSource(options)

        await dataSource.initialize();

        clazzMap.set(DataSource as Clazz,dataSource);
    }
}

const sqliteOptionsPrefx = 'j-spring-jpa.sqlite'

@Component()
export class SqliteStarter extends BaseDataSourceConnect {

    @Value({path:`${sqliteOptionsPrefx}.name`,type:String,force:false })
    name:string = 'sqlite';

    @Value({path:`${sqliteOptionsPrefx}.database`,type:String,force:false})
    database:string = './data.db';

    getOptions(entities:Function[]): DataSourceOptions {
        const {name,database} = this;
        const options: DataSourceOptions = {
            name,
            type: "sqlite",
            database,
            logging: true,
            synchronize: true,
            entities
        }
        return options;
    }

}