import { Component, Autowired, Clazz, Anntation } from 'j-spring';
import { ParamEnhanceInterceptor } from 'j-spring-web';
import { EntityManager, DataSource, QueryRunner } from 'typeorm';
import { Tx, TxParam } from './annotation';
import { SpringTx } from './springTx';

@Component()
export class TxParamEnhanceInterceptor
  implements ParamEnhanceInterceptor<SpringTx> {
  @Autowired({ clazz: DataSource as Clazz })
  dataSource: DataSource;

  isParamEnhanceInterceptor(): boolean {
    return true;
  }
  getAnnotation(): Function {
    return Tx;
  }
  async getBean(
    _req: any,
    _res: any,
    paramterAnnotation: Anntation
  ): Promise<SpringTx> {
    const txParam = paramterAnnotation.params as TxParam;
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    const manager: EntityManager = queryRunner.manager;
    const tx = new SpringTx(manager, txParam);
    if (txParam.isAutoStartTx) tx.startTransaction();
    return tx;
  }
  error(bean: SpringTx): void {
    if (bean.txParam.isAutoStartTx) bean.rollbackTransaction();
    bean.e.queryRunner?.release();
  }
  success(bean: SpringTx): void {
    if (bean.txParam.isAutoStartTx) bean.commitTransaction();
    bean.e.queryRunner?.release();
  }
}
