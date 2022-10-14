type formatType = {
  type: Function;
  doFormat: (value: any) => any;
};

const formTypeList: formatType[] = [
  {
    type: String,
    doFormat: value => '' + value,
  },
  {
    type: Number,
    doFormat: (value: any) => {
      const n = +value;
      if (Number.isNaN(n)) throw `value:${value} is NaN`;
      return n;
    },
  },
  {
    type: Object,
    doFormat: v => v,
  },
  {
    type: Boolean,
    doFormat: (v: any) => {
      if (typeof v === 'string' && v === 'true') {
        return true;
      }
      return v === true;
    },
  },
  {
    type: Array,
    doFormat: (v: string) => v.split(','),
  },
];

export function isCanFormat(type: Function): boolean {
  return formTypeList.map(f => f.type).indexOf(type) > -1;
}

/**
 * 基础属性转换
 * @param value 值
 * @param type 类型
 * @returns 返回转换后的值
 */
export function doForamtPlainValue(value: any, type: Function): any {
  const form = formTypeList.find(f => f.type === type);
  if (form) {
    return form.doFormat(value);
  } else {
    throw `type[${type}] not support to convert`;
  }
}
