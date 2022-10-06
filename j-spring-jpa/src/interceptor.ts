import { Component,Autowired, Clazz,Anntation } from 'j-spring'
import {SpringWebParamInteceptor} from 'j-spring-web'
import {EntityManager,DataSource,QueryRunner} from 'typeorm'
import {Tx} from './annotation'
import {SpringTx} from './springTx'


@Component()
export class TxParamInteceptor implements SpringWebParamInteceptor<SpringTx> {

    @Autowired({clazz:DataSource as Clazz})
    dataSource:DataSource;

    isSpringWebParamInteceptor(): boolean {
        return true;
    }
    getAnnotation(): Function {
        return Tx;
    }
    async getBean(_req: any, _res: any, _paramterAnnotation: Anntation): Promise<SpringTx> {
        const queryRunner:QueryRunner = this.dataSource.createQueryRunner()
        const manager:EntityManager = queryRunner.manager;
        await queryRunner.startTransaction();
        return new SpringTx(manager);
    }
    error(bean: SpringTx): void {
        bean.e.queryRunner?.rollbackTransaction();
        bean.e.queryRunner?.release();
    }
    success(bean: SpringTx): void {
        bean.e.queryRunner?.commitTransaction();
        bean.e.queryRunner?.release();
    }
    
}