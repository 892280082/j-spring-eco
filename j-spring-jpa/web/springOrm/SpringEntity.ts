import { PrimaryColumn,Generated,EntityManager, Repository } from 'typeorm'
import { Tx } from '../../src';

export class BasePojo  {

    @PrimaryColumn()
    @Generated()
    id: number

    save(tx:SpringTx){
        return tx.save(this);
    }

    remove(tx:SpringTx){
        return tx.remove(this);
    }

    update(tx:SpringTx){
        return tx.update(this);
    }
}


export class BaseSearch<T extends BasePojo> {

    curPage:number = 1;

    pageSize:number = 20;

    allCount:number = 0;


    

}

export class SpringTx {

    constructor(public e:EntityManager){

    }

    private getRepository(entity:BasePojo):Repository<any>{
        const clazz = (entity as any).constructor;
        return this.e.getRepository(clazz);
    }

    save(entity:BasePojo){
       return this.getRepository(entity).save(entity);
    }

    remove(entity:BasePojo){
        return this.getRepository(entity).remove(entity);
    }

    async update(entity:BasePojo){
        const repository = this.getRepository(entity);
        const oldEntity = await repository.findOneBy({id:entity.id});
        if(!oldEntity)
            throw `data ${entity} not exist!`
        Object.assign(oldEntity,entity);

        const colMeta = repository.metadata.columns

        const a = colMeta;
    }


}