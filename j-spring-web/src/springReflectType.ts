import {
  RequestAbs,
  ResponseAbs,
  ExpressAppAbs,
  ExpressServerAbs,
} from 'j-spring-type-wrap';

export class Request extends RequestAbs {}

export class Response extends ResponseAbs {}

export class ExpressApp extends ExpressAppAbs {}

export class ExpressServer extends ExpressServerAbs {}

export class ArrayString extends Array<string> {}

export class ArrayNumber extends Array<number> {}

export class Session {
  constructor(private data: any) {}
  get(key: string, defaultValue?: any) {
    const v = this.data[key];
    if (v === void 0 && defaultValue !== void 0) return defaultValue;
    return v;
  }
  set(key: string, value: any) {
    this.data[key] = value;
    return this;
  }
}

// import { CookieOptions } from 'express';

// export class ArrayString extends Array<string> {}

// export class ArrayNumber extends Array<number> {}

// type requestAccept = (key: string) => string | boolean;
// type sendObj = (data: any) => Response;
// type Errback = (err: Error) => void;
// type operateFile = (
//   path: string,
//   options?: any | Errback,
//   errCall?: Errback
// ) => void;
// type setField = (key: string) => Response;

// // export class Request {
// //   app: ExpressApp;
// //   baseUrl: string;
// //   body: any;
// //   cookies: Record<string, string>;
// //   fresh: boolean;
// //   hostname: string;
// //   ip: string;
// //   method: 'GET, POST, PUT';
// //   originalUrl: string;
// //   params: Record<string, string>;
// //   path: string;
// //   protocol: string;
// //   query: Record<string, string>;
// //   res: Response;
// //   secure: boolean;
// //   signedCookies: any;
// //   stale: boolean;
// //   subdomains: string[];
// //   xhr: boolean;
// //   accepts: requestAccept;
// //   acceptsEncodings: requestAccept;
// //   acceptsLanguages: requestAccept;
// //   get: (key: string) => string | undefined;
// //   is: requestAccept;
// //   param: (key: string, defaultV?: string) => string;
// // }

// export interface MediaType {
//   value: string;
//   quality: number;
//   type: string;
//   subtype: string;
// }

// export class Request {
//   get: (name: string) => string | undefined;
//   header: (name: string) => string | undefined;
//   accepts: (type?: string) => string | false | string[];
//   acceptsCharsets: (...charset: string[]) => string | false | string[];
//   acceptsEncodings: (...charset: string[]) => string | false | string[];
//   acceptsLanguages: (...charset: string[]) => string | false | string[];
//   range: (size: number, options?: { combine?: boolean }) => any;
//   accepted: MediaType[];
//   param(name: string, defaultValue?: any): string;
//   is(type: string | string[]): string | false | null;
//   protocol: string;
//   secure: boolean;
//   ip: string;
//   ips: string[];
//   subdomains: string[];
//   path: string;

// }

// export class Response {
//   app: ExpressApp;
//   headersSent: boolean;
//   locals: any;
//   cookie: (key: string, value: any, option?: CookieOptions) => void;
//   status: (code: number) => this;
//   sendStatus: (code: number) => this;
//   links: (links: any) => Response;
//   send: sendObj;
//   json: sendObj;
//   jsonp: sendObj;
//   sendFile: operateFile;
//   download: (path: string, filename: string, option: any, fn?: Errback) => void;
//   contentType: setField;
//   type: setField;
//   format: (obj: any) => this;
//   attachment: (filename?: string) => Response;
//   set: (field: string, value?: string | string[]) => Response;
//   header: (field: string, value?: string | string[]) => Response;
//   get: (field: string) => string | undefined;
//   location: setField;
//   redirect: (status: number | string, url?: string) => void;
//   vary: setField;
//   append: (field: string, value?: string[] | string) => Response;
//   req: Request;
// }

// //这是一个实际包装类 所有拥有实际API
// export class Session {
//   constructor(private data: any) {}
//   get(key: string) {
//     return this.data[key];
//   }
//   set(key: string, value: any) {
//     this.data[key] = value;
//     return this;
//   }
// }

// type setCall = (_key: string | Function, ..._call: Function[]) => any;

// export class ExpressApp {
//   set: (_key: string, _v: any) => void;
//   get: setCall;
//   use: setCall;
//   post: setCall;
//   engine: (
//     ext: string,
//     fn: (
//       path: string,
//       options: object,
//       callback: (e: any, rendered?: string) => void
//     ) => void
//   ) => ExpressApp;
//   enabled: (setting: string) => boolean;
//   disabled: (setting: string) => boolean;
//   enable: (setting: string) => this;
//   disable: (setting: string) => this;
//   mountpath: string | string[];
//   locals: Record<string, any>;
//   on: (event: string, callback: (parent: ExpressApp) => void) => this;
// }

// export class ExpressServer {
//   close(_done: Function) {}
//   setTimeout: (msecs?: number, callback?: () => void) => ExpressServer;
//   maxHeadersCount: number | null;
// }
