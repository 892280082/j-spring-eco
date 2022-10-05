import { convertOption } from './springTxUtil'
import { EntityManager,Repository,PrimaryColumn,Generated, EntityTarget,CreateDateColumn } from 'typeorm'

type EntityOption<T> = {
    [P in keyof T]?: T[P]
}

type EntityList = BaseEntity<any> | BaseEntity<any>[];

export class BaseEntity<T>  {

    of(prop?:EntityOption<T>){
        if(prop){
            Object.assign(this,prop);
        }
        return this;
    }

    @PrimaryColumn()
    @Generated()
    id: number

    @CreateDateColumn()
    crateTime:Date;

}


export abstract class BaseSearch<T extends BaseEntity<T>,S extends BaseSearch<T,S>> {

    constructor(public readonly entityTarget:EntityTarget<T>){}

    curPage:number = 1;

    pageSize:number = 20;

    of(prop?:EntityOption<S>){
        if(prop){
            Object.assign(this,prop);
        }
        return this;
    }

    find(tx:SpringTx):Promise<T[]>{
        const option = convertOption(this);
        return tx.e.find(this.entityTarget,{ where:option });
    }

}

export class SpringTx {

    constructor(public readonly e:EntityManager){

    }

    private getRepository(entity:BaseEntity<any>):Repository<any>{
        const clazz = (entity as any).constructor;
        return this.e.getRepository(clazz);
    }

    private getRepositoryBySearch(search:BaseSearch<any,any>):Repository<any>{
        return this.e.getRepository(search.entityTarget);
    }

    private async doOperate(entity:EntityList,op:(r:Repository<any>,b:any)=>Promise<void>){
        let ds = Array.isArray(entity) ? entity:[entity];
        for(let p of ds){
            const r = this.getRepository(p);
            await op(r,p);
        }
    }



    save(entity:EntityList):Promise<void>{
        return this.doOperate(entity,(r,b) => r.save(b))
    }

    remove(entity:EntityList):Promise<void>{
        return this.doOperate(entity,(r,b) => r.remove(b))
    }


    update(entity:EntityList):Promise<void>{
        return this.doOperate(entity,async (r,b) => {
            await r.update({id:b.id},b);
        })
    }

    //获取id集合
    async getIds<T extends BaseEntity<T>>(search:BaseSearch<T,any>):Promise<number[]>{
        const option = convertOption(search);
        const entityList = await this.e.find(search.entityTarget,{ where:option,select:['id'] });
        return entityList.map(e => e.id);
    }

    //批量更新
    async batchUpdate<T extends BaseEntity<T>>(search:BaseSearch<T,any>,partEntity:EntityOption<T>):Promise<number>{
        const r = this.getRepositoryBySearch(search);
        const ids = await this.getIds(search);
        for(let id of ids){
            await r.update({id},partEntity)
        }
        return ids.length;
    }

    //批量删除
    async batchRemove<T extends BaseEntity<T>>(search:BaseSearch<T,any>):Promise<number>{
        const r = this.getRepositoryBySearch(search);
        const ids = await this.getIds(search);
        for(let id of ids){
            await r.delete(id)
        }
        return ids.length;
    }

    find<T extends BaseEntity<T>>(search:BaseSearch<T,any>):Promise<T[]>{
        const option = convertOption(search);
        return this.e.find(search.entityTarget,{ where:option });
    }


    //查询
    query(query: string, parameters?: any[]): Promise<any> {
        return this.e.query(query,parameters);
    }
        

}

