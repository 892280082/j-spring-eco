type formatType = {
    type:Function;
    doFormat:(value:any)=>any;
}

const formTypeList:formatType[] = [
    {
        type:String,
        doFormat:(value) => ""+value
    },
    {
        type:Number,
        doFormat:(value:any) => {
            const n = +value;
            if(Number.isNaN(n))
                throw(`value:${value} is NaN`)
            return n;
        }
    },
    {
        type:Object,
        doFormat:(v) => v
    },
    {
        type:Boolean,
        doFormat:(v:any) => {
            if(typeof v === 'string' && v === 'true'){
               return true;
            }
            return v === true;
        }
    }
]

export function isCanFormat(type:Function):boolean {
    return formTypeList.map(f => f.type).indexOf(type) > -1;
}

export function doForamtPlainValue(value:any,type:Function):any{
    const form = formTypeList.find(f => f.type === type)
    if(form){
        return form.doFormat(value);
    }else{
         throw(`type[${type}] not support to convert`)
    }
}