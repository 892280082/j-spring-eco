
import { Component,Autowired, Clazz,Anntation } from 'j-spring'
import {SpringWebParamInteceptor} from 'j-spring-web'
import {EntityManager,DataSource,QueryRunner} from 'typeorm'
import {Tx} from './annotation'


@Component()
export class TxParamInteceptor implements SpringWebParamInteceptor<EntityManager> {

    @Autowired({clazz:DataSource as Clazz})
    dataSource:DataSource;

    isSpringWebParamInteceptor(): boolean {
        return true;
    }
    getAnnotation(): Function {
        return Tx;
    }
    async getBean(_req: any, _res: any, _paramterAnnotation: Anntation): Promise<EntityManager> {
        const queryRunner:QueryRunner = this.dataSource.createQueryRunner()
        const manager:EntityManager = queryRunner.manager;
        await queryRunner.startTransaction();
        return manager;
    }
    error(bean: EntityManager): void {
        bean.queryRunner?.rollbackTransaction();
        bean.queryRunner?.release();
    }
    success(bean: EntityManager): void {
        bean.queryRunner?.commitTransaction();
        bean.queryRunner?.release();
    }
    
}