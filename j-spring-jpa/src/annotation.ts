import { EntityOptions,getMetadataArgsStorage } from 'typeorm'
import { spring,triggerClassAnnotation,Anntation, Clazz } from 'j-spring'

function isObject(val: any): val is Object {
    return val !== null && typeof val === "object"
}

export function SpringEntity(
    nameOrOptions?: string | EntityOptions,
    maybeOptions?: EntityOptions,
): ClassDecorator {
    const options =
        (isObject(nameOrOptions)
            ? (nameOrOptions as EntityOptions)
            : maybeOptions) || {}
    const name =
        typeof nameOrOptions === "string" ? nameOrOptions : options.name

    return function (target) {  

        triggerClassAnnotation(target as any,new Anntation('spring.SpringEntity',SpringEntity,{nameOrOptions}))

        getMetadataArgsStorage().tables.push({
            target: target,
            name: name,
            type: "regular",
            orderBy: options.orderBy ? options.orderBy : undefined,
            engine: options.engine ? options.engine : undefined,
            database: options.database ? options.database : undefined,
            schema: options.schema ? options.schema : undefined,
            synchronize: options.synchronize,
            withoutRowid: options.withoutRowid,
        } as any)
    }
}

export const Table = () => spring.classAnnotationGenerator('sqlite-jdbc.Table',{},Table);

export const Tx = () => spring.paramterAnnotationGenerator('sqlite-jdbc.Table','NoName',{},Tx);