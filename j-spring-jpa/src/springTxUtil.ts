


export function convertOption(search:any):any {
    const option:any = {};
    const innerKeyList = ['entityTarget','curPage','pageSize'];
    //初次过滤属性
    for(const p in search){
        if(search[p] !== null && search[p] !== void 0 && innerKeyList.indexOf(p) === -1){
            option[p] = search[p];
        }
    }
    //处理末尾条件
    for(const p in option){
      const attrs = p.split('_')
      if(attrs.length == 2){
        delete option[p];
        option[attrs[0]] = `NOT(${p})`
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

