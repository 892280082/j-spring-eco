export class ArrayString extends Array<string> {}

export class ArrayNumber extends Array<number> {}

export class Request {}

export class Response {}

export class Session {
  constructor(private data: any) {}
  get(key: string) {
    return this.data[key];
  }
  set(key: string, value: any) {
    this.data[key] = value;
    return this;
  }
}

export class ExpressApp {}

export class ExpressServer {
  close(_done: Function) {}
}
