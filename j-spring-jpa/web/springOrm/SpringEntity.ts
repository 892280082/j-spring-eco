import { PrimaryColumn,Generated,EntityManager, Repository, EntityTarget } from 'typeorm'
import { Tx } from '../../src';

export class BasePojo<T>  {

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

    of(prop?:PostSearchOption<T>){
        if(prop){
            Object.assign(this,prop);
        }
        return this;
    }
}

type PostSearchOption<T> = {
    [P in keyof T]?: number|string|Array<any>
}

export class BaseSearch<T extends BasePojo<any>,S extends BaseSearch<any,any>> {

    constructor(private readonly entityTarget:EntityTarget<T>){}

    curPage:number = 1;

    pageSize:number = 20;

    of(prop?:PostSearchOption<S>){
        if(prop){
            Object.assign(this,prop);
        }
        return this;
    }

    find(tx:SpringTx):Promise<T[]>{
        const option = convertOption(this);
        return tx.e.find(this.entityTarget,{where:option});
    }

    static ofId(id:number){

    }

}

function convertOption(search:BaseSearch<any,any>):any {
    const option = {};
    const innerKeyList = ['entityTarget','curPage','pageSize'];
    for(const p in search){

        if(search[p] !== null && search[p] !== void 0 && innerKeyList.indexOf(p) === -1){

            option[p] = search[p];

        }

    }
    return option;
}


export class SpringTx {

    constructor(public e:EntityManager){

    }

    getRepository(entity:BasePojo<any>):Repository<any>{
        const clazz = (entity as any).constructor;
        return this.e.getRepository(clazz);
    }

    save(entity:BasePojo<any>){
       return this.getRepository(entity).save(entity);
    }

    remove(entity:BasePojo<any>){
        return this.getRepository(entity).remove(entity);
    }

    async update(entity:BasePojo<any>){
        const repository = this.getRepository(entity);
        const oldEntity = await repository.findOneBy({id:entity.id});
        if(!oldEntity)
            throw `data ${entity} not exist!`
        Object.assign(oldEntity,entity);

        await repository.update({id:oldEntity.id},oldEntity);

    }


}

