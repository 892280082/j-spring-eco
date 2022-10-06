import { isFunction } from "j-spring";
import { BaseSearch,BaseEntity } from "./springTx";
import {
  FindManyOptions,
  FindOperator,
  Not,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Equal,
  Like,
  ILike,
  Between,
  In,
  Any,
  IsNull,
}  from 'typeorm'


function formatValue(type:string,value:any):FindOperator<any>{
  switch(type){
    case 'not':return Not(value);
    case 'lt':return LessThan(value);
    case 'lte':return LessThanOrEqual(value);
    case 'gt':return MoreThan(value);
    case 'gte':return MoreThanOrEqual(value);
    case 'eq':return Equal(value);
    case 'like':return  value.indexOf('%') === -1 ? Like(`%${value}%`) : Like(value) ;
    case 'ILike':return ILike(`%${value}%`);
    case 'between':return Between(value[0],value[1]);
    case 'in':return In(value);
    case 'any':return Any(value);
    case 'null':return value === 0 ? IsNull() : Not(IsNull()) ;
    default:
      throw `not support findOperate ${type}`
  } 
}

export function convertToWhere(search:any):any {
    const option:any = {};
    const innerKeyList = [
      'entityTarget',
      'curPage',
      'pageSize',
      '$relatirelationLoadStrategy',
      '$relations',
      '$cache',
      '$order',
      '$isUsePagin',
      '$comment'];
    //初次过滤属性
    for(const p in search){
        if(search[p] !== null && search[p] !== void 0 && innerKeyList.indexOf(p) === -1 && !isFunction(search[p])){
            option[p] = search[p];
        }
    }
    //处理末尾条件
    for(const p in option){
      const attrs = p.split('_')
      if(attrs.length == 2){
        option[attrs[0]] = formatValue(attrs[1],option[p])
        delete option[p];
      }      
    }
    //处理梯度
    for(const p in option){
      const fields = p.split('$')
      if(fields.length>1){
        let c = option;
        for(let i=0;i<fields.length-1;i++){
          const cf = fields[i];
          if(c[cf] === void 0){
            c[cf] = {}
            c = c[cf];
          }
        }
        c[fields[fields.length-1]] = option[p];
        delete option[p];
      }
    }
    return option;
}


function convertSkip(search:BaseSearch<any,any>){
  return search.$isUsePagin ? (search.curPage-1)*search.pageSize : undefined;
}

export function convertSearch<T extends BaseEntity<T>>(search:BaseSearch<T,any>):FindManyOptions<T>{


  const options:FindManyOptions<T> = {
    where:convertToWhere(search),
    skip:convertSkip(search),
    take:search.$isUsePagin ? search.pageSize : undefined,
    relations:search.$relations,
    relationLoadStrategy:search.$relatirelationLoadStrategy,
    order:search.$order,
    cache:search.$cache,
    comment:search.$comment
  };


  return options;
  
}