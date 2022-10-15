import {
  Request,
  MediaType,
  ParamsDictionary,
  Response,
  NextFunction,
  CookieOptions,
  Errback,
  Application,
  RequestParamHandler,
  Send,
} from 'express-serve-static-core';
import http, {
  IncomingHttpHeaders,
  IncomingMessage,
  OutgoingHttpHeader,
  OutgoingHttpHeaders,
  RequestListener,
  Server,
  ServerResponse,
} from 'http';
import { AddressInfo, ListenOptions, Socket } from 'net';
import { ParsedQs } from 'qs';
import { Options, Ranges, Result } from 'range-parser';
import { Duplex, Readable } from 'stream';
export class RequestAbs implements Request {
  /**addd***/
  session: Record<string, any> | undefined;
  /***AUTO***/
  get(name: 'set-cookie'): string[] | undefined;
  get(name: string): string | undefined;
  header(name: 'set-cookie'): string[] | undefined;
  header(name: string): string | undefined;
  accepts(): string[];
  accepts(type: string): string | false;
  accepts(type: string[]): string | false;
  accepts(...type: string[]): string | false;
  acceptsCharsets(): string[];
  acceptsCharsets(charset: string): string | false;
  acceptsCharsets(charset: string[]): string | false;
  acceptsCharsets(...charset: string[]): string | false;
  acceptsEncodings(): string[];
  acceptsEncodings(encoding: string): string | false;
  acceptsEncodings(encoding: string[]): string | false;
  acceptsEncodings(...encoding: string[]): string | false;
  acceptsLanguages(): string[];
  acceptsLanguages(lang: string): string | false;
  acceptsLanguages(lang: string[]): string | false;
  acceptsLanguages(...lang: string[]): string | false;
  range(
    size: number,
    options?: Options | undefined
  ): Ranges | Result | undefined;
  accepted: MediaType[];
  param(name: string, defaultValue?: any): string;
  is(type: string | string[]): string | false | null;
  protocol: string;
  secure: boolean;
  ip: string;
  ips: string[];
  subdomains: string[];
  path: string;
  hostname: string;
  host: string;
  fresh: boolean;
  stale: boolean;
  xhr: boolean;
  body: any;
  cookies: any;
  method: string;
  params: ParamsDictionary;
  query: ParsedQs;
  route: any;
  signedCookies: any;
  originalUrl: string;
  url: string;
  baseUrl: string;
  app: Application<Record<string, any>>;
  res?: Response<any, Record<string, any>, number> | undefined;
  next?: NextFunction | undefined;
  aborted: boolean;
  httpVersion: string;
  httpVersionMajor: number;
  httpVersionMinor: number;
  complete: boolean;
  connection: Socket;
  socket: Socket;
  headers: IncomingHttpHeaders;
  rawHeaders: string[];
  trailers: NodeJS.Dict<string>;
  rawTrailers: string[];
  setTimeout(msecs: number, callback?: (() => void) | undefined): this;
  statusCode?: number | undefined;
  statusMessage?: string | undefined;
  destroy(error?: Error | undefined): this;
  readableAborted: boolean;
  readable: boolean;
  readableDidRead: boolean;
  readableEncoding: BufferEncoding | null;
  readableEnded: boolean;
  readableFlowing: boolean | null;
  readableHighWaterMark: number;
  readableLength: number;
  readableObjectMode: boolean;
  destroyed: boolean;
  closed: boolean;
  errored: Error | null;
  _construct?(callback: (error?: Error | null | undefined) => void): void;
  _read(size: number): void;
  read(size?: number | undefined);
  setEncoding(encoding: BufferEncoding): this;
  pause(): this;
  resume(): this;
  isPaused(): boolean;
  unpipe(destination?: NodeJS.WritableStream | undefined): this;
  unshift(chunk: any, encoding?: BufferEncoding | undefined): void;
  wrap(stream: NodeJS.ReadableStream): this;
  push(chunk: any, encoding?: BufferEncoding | undefined): boolean;
  _destroy(
    error: Error | null,
    callback: (error?: Error | null | undefined) => void
  ): void;
  addListener(event: 'close', listener: () => void): this;
  addListener(event: 'data', listener: (chunk: any) => void): this;
  addListener(event: 'end', listener: () => void): this;
  addListener(event: 'error', listener: (err: Error) => void): this;
  addListener(event: 'pause', listener: () => void): this;
  addListener(event: 'readable', listener: () => void): this;
  addListener(event: 'resume', listener: () => void): this;
  addListener(event: string | symbol, listener: (...args: any[]) => void): this;
  emit(event: 'close'): boolean;
  emit(event: 'data', chunk: any): boolean;
  emit(event: 'end'): boolean;
  emit(event: 'error', err: Error): boolean;
  emit(event: 'pause'): boolean;
  emit(event: 'readable'): boolean;
  emit(event: 'resume'): boolean;
  emit(event: string | symbol, ...args: any[]): boolean;
  on(event: 'close', listener: () => void): this;
  on(event: 'data', listener: (chunk: any) => void): this;
  on(event: 'end', listener: () => void): this;
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'pause', listener: () => void): this;
  on(event: 'readable', listener: () => void): this;
  on(event: 'resume', listener: () => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this;
  once(event: 'close', listener: () => void): this;
  once(event: 'data', listener: (chunk: any) => void): this;
  once(event: 'end', listener: () => void): this;
  once(event: 'error', listener: (err: Error) => void): this;
  once(event: 'pause', listener: () => void): this;
  once(event: 'readable', listener: () => void): this;
  once(event: 'resume', listener: () => void): this;
  once(event: string | symbol, listener: (...args: any[]) => void): this;
  prependListener(event: 'close', listener: () => void): this;
  prependListener(event: 'data', listener: (chunk: any) => void): this;
  prependListener(event: 'end', listener: () => void): this;
  prependListener(event: 'error', listener: (err: Error) => void): this;
  prependListener(event: 'pause', listener: () => void): this;
  prependListener(event: 'readable', listener: () => void): this;
  prependListener(event: 'resume', listener: () => void): this;
  prependListener(
    event: string | symbol,
    listener: (...args: any[]) => void
  ): this;
  prependOnceListener(event: 'close', listener: () => void): this;
  prependOnceListener(event: 'data', listener: (chunk: any) => void): this;
  prependOnceListener(event: 'end', listener: () => void): this;
  prependOnceListener(event: 'error', listener: (err: Error) => void): this;
  prependOnceListener(event: 'pause', listener: () => void): this;
  prependOnceListener(event: 'readable', listener: () => void): this;
  prependOnceListener(event: 'resume', listener: () => void): this;
  prependOnceListener(
    event: string | symbol,
    listener: (...args: any[]) => void
  ): this;
  removeListener(event: 'close', listener: () => void): this;
  removeListener(event: 'data', listener: (chunk: any) => void): this;
  removeListener(event: 'end', listener: () => void): this;
  removeListener(event: 'error', listener: (err: Error) => void): this;
  removeListener(event: 'pause', listener: () => void): this;
  removeListener(event: 'readable', listener: () => void): this;
  removeListener(event: 'resume', listener: () => void): this;
  removeListener(
    event: string | symbol,
    listener: (...args: any[]) => void
  ): this;
  [Symbol.asyncIterator](): AsyncIterableIterator<any>;
  pipe<T extends NodeJS.WritableStream>(
    destination: T,
    options?: { end?: boolean | undefined } | undefined
  ): T;
  off(eventName: string | symbol, listener: (...args: any[]) => void): this;
  off(eventName: string | symbol, listener: (...args: any[]) => void): this;
  off(eventName: string | symbol, listener: (...args: any[]) => void): this;
  removeAllListeners(event?: string | symbol | undefined): this;
  removeAllListeners(event?: string | symbol | undefined): this;
  removeAllListeners(event?: string | symbol | undefined): this;
  setMaxListeners(n: number): this;
  setMaxListeners(n: number): this;
  setMaxListeners(n: number): this;
  getMaxListeners(): number;
  getMaxListeners(): number;
  getMaxListeners(): number;
  listeners(eventName: string | symbol): Function[];
  listeners(eventName: string | symbol): Function[];
  listeners(eventName: string | symbol): Function[];
  rawListeners(eventName: string | symbol): Function[];
  rawListeners(eventName: string | symbol): Function[];
  rawListeners(eventName: string | symbol): Function[];
  listenerCount(eventName: string | symbol): number;
  listenerCount(eventName: string | symbol): number;
  listenerCount(eventName: string | symbol): number;
  eventNames(): (string | symbol)[];
  eventNames(): (string | symbol)[];
  eventNames(): (string | symbol)[];
}
export class ResponseAbs implements Response {
  status(code: number): this;
  sendStatus(code: number): this;
  links(links: any): this;
  send: Send<any, this>;
  json: Send<any, this>;
  jsonp: Send<any, this>;
  sendFile(path: string, fn?: Errback | undefined): void;
  sendFile(path: string, options: any, fn?: Errback | undefined): void;
  sendfile(path: string): void;
  sendfile(path: string, options: any): void;
  sendfile(path: string, fn: Errback): void;
  sendfile(path: string, options: any, fn: Errback): void;
  download(path: string, fn?: Errback | undefined): void;
  download(path: string, filename: string, fn?: Errback | undefined): void;
  download(
    path: string,
    filename: string,
    options: any,
    fn?: Errback | undefined
  ): void;
  contentType(type: string): this;
  type(type: string): this;
  format(obj: any): this;
  attachment(filename?: string | undefined): this;
  set(field: any): this;
  set(field: string, value?: string | string[] | undefined): this;
  header(field: any): this;
  header(field: string, value?: string | string[] | undefined): this;
  headersSent: boolean;
  get(field: string): string | undefined;
  clearCookie(name: string, options?: CookieOptions | undefined): this;
  cookie(name: string, val: string, options: CookieOptions): this;
  cookie(name: string, val: any, options: CookieOptions): this;
  cookie(name: string, val: any): this;
  location(url: string): this;
  redirect(url: string): void;
  redirect(status: number, url: string): void;
  redirect(url: string, status: number): void;
  render(
    view: string,
    options?: object | undefined,
    callback?: ((err: Error, html: string) => void) | undefined
  ): void;
  render(
    view: string,
    callback?: ((err: Error, html: string) => void) | undefined
  ): void;
  locals: Record<string, any>;
  charset: string;
  vary(field: string): this;
  app: Application<Record<string, any>>;
  append(field: string, value?: string | string[] | undefined): this;
  req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;
  statusCode: number;
  statusMessage: string;
  assignSocket(socket: Socket): void;
  detachSocket(socket: Socket): void;
  writeContinue(callback?: (() => void) | undefined): void;
  writeHead(
    statusCode: number,
    statusMessage?: string | undefined,
    headers?: OutgoingHttpHeaders | OutgoingHttpHeader[] | undefined
  ): this;
  writeHead(
    statusCode: number,
    headers?: OutgoingHttpHeaders | OutgoingHttpHeader[] | undefined
  ): this;
  writeProcessing(): void;
  chunkedEncoding: boolean;
  shouldKeepAlive: boolean;
  useChunkedEncodingByDefault: boolean;
  sendDate: boolean;
  finished: boolean;
  connection: Socket | null;
  socket: Socket | null;
  setTimeout(msecs: number, callback?: (() => void) | undefined): this;
  setHeader(name: string, value: string | number | readonly string[]): this;
  getHeader(name: string): string | number | string[] | undefined;
  getHeaders(): OutgoingHttpHeaders;
  getHeaderNames(): string[];
  hasHeader(name: string): boolean;
  removeHeader(name: string): void;
  addTrailers(headers: OutgoingHttpHeaders | readonly [string, string][]): void;
  flushHeaders(): void;
  writable: boolean;
  writableEnded: boolean;
  writableFinished: boolean;
  writableHighWaterMark: number;
  writableLength: number;
  writableObjectMode: boolean;
  writableCorked: number;
  destroyed: boolean;
  closed: boolean;
  errored: Error | null;
  writableNeedDrain: boolean;
  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null | undefined) => void
  ): void;
  _writev?(
    chunks: { chunk: any; encoding: BufferEncoding }[],
    callback: (error?: Error | null | undefined) => void
  ): void;
  _construct?(callback: (error?: Error | null | undefined) => void): void;
  _destroy(
    error: Error | null,
    callback: (error?: Error | null | undefined) => void
  ): void;
  _final(callback: (error?: Error | null | undefined) => void): void;
  write(
    chunk: any,
    callback?: ((error: Error | null | undefined) => void) | undefined
  ): boolean;
  write(
    chunk: any,
    encoding: BufferEncoding,
    callback?: ((error: Error | null | undefined) => void) | undefined
  ): boolean;
  setDefaultEncoding(encoding: BufferEncoding): this;
  end(cb?: (() => void) | undefined): this;
  end(chunk: any, cb?: (() => void) | undefined): this;
  end(
    chunk: any,
    encoding: BufferEncoding,
    cb?: (() => void) | undefined
  ): this;
  cork(): void;
  uncork(): void;
  destroy(error?: Error | undefined): this;
  addListener(event: 'close', listener: () => void): this;
  addListener(event: 'drain', listener: () => void): this;
  addListener(event: 'error', listener: (err: Error) => void): this;
  addListener(event: 'finish', listener: () => void): this;
  addListener(event: 'pipe', listener: (src: Readable) => void): this;
  addListener(event: 'unpipe', listener: (src: Readable) => void): this;
  addListener(event: string | symbol, listener: (...args: any[]) => void): this;
  emit(event: 'close'): boolean;
  emit(event: 'drain'): boolean;
  emit(event: 'error', err: Error): boolean;
  emit(event: 'finish'): boolean;
  emit(event: 'pipe', src: Readable): boolean;
  emit(event: 'unpipe', src: Readable): boolean;
  emit(event: string | symbol, ...args: any[]): boolean;
  on(event: 'close', listener: () => void): this;
  on(event: 'drain', listener: () => void): this;
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'finish', listener: () => void): this;
  on(event: 'pipe', listener: (src: Readable) => void): this;
  on(event: 'unpipe', listener: (src: Readable) => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this;
  once(event: 'close', listener: () => void): this;
  once(event: 'drain', listener: () => void): this;
  once(event: 'error', listener: (err: Error) => void): this;
  once(event: 'finish', listener: () => void): this;
  once(event: 'pipe', listener: (src: Readable) => void): this;
  once(event: 'unpipe', listener: (src: Readable) => void): this;
  once(event: string | symbol, listener: (...args: any[]) => void): this;
  prependListener(event: 'close', listener: () => void): this;
  prependListener(event: 'drain', listener: () => void): this;
  prependListener(event: 'error', listener: (err: Error) => void): this;
  prependListener(event: 'finish', listener: () => void): this;
  prependListener(event: 'pipe', listener: (src: Readable) => void): this;
  prependListener(event: 'unpipe', listener: (src: Readable) => void): this;
  prependListener(
    event: string | symbol,
    listener: (...args: any[]) => void
  ): this;
  prependOnceListener(event: 'close', listener: () => void): this;
  prependOnceListener(event: 'drain', listener: () => void): this;
  prependOnceListener(event: 'error', listener: (err: Error) => void): this;
  prependOnceListener(event: 'finish', listener: () => void): this;
  prependOnceListener(event: 'pipe', listener: (src: Readable) => void): this;
  prependOnceListener(event: 'unpipe', listener: (src: Readable) => void): this;
  prependOnceListener(
    event: string | symbol,
    listener: (...args: any[]) => void
  ): this;
  removeListener(event: 'close', listener: () => void): this;
  removeListener(event: 'drain', listener: () => void): this;
  removeListener(event: 'error', listener: (err: Error) => void): this;
  removeListener(event: 'finish', listener: () => void): this;
  removeListener(event: 'pipe', listener: (src: Readable) => void): this;
  removeListener(event: 'unpipe', listener: (src: Readable) => void): this;
  removeListener(
    event: string | symbol,
    listener: (...args: any[]) => void
  ): this;
  pipe<T extends NodeJS.WritableStream>(
    destination: T,
    options?: { end?: boolean | undefined } | undefined
  ): T;
  off(eventName: string | symbol, listener: (...args: any[]) => void): this;
  off(eventName: string | symbol, listener: (...args: any[]) => void): this;
  off(eventName: string | symbol, listener: (...args: any[]) => void): this;
  removeAllListeners(event?: string | symbol | undefined): this;
  removeAllListeners(event?: string | symbol | undefined): this;
  removeAllListeners(event?: string | symbol | undefined): this;
  setMaxListeners(n: number): this;
  setMaxListeners(n: number): this;
  setMaxListeners(n: number): this;
  getMaxListeners(): number;
  getMaxListeners(): number;
  getMaxListeners(): number;
  listeners(eventName: string | symbol): Function[];
  listeners(eventName: string | symbol): Function[];
  listeners(eventName: string | symbol): Function[];
  rawListeners(eventName: string | symbol): Function[];
  rawListeners(eventName: string | symbol): Function[];
  rawListeners(eventName: string | symbol): Function[];
  listenerCount(eventName: string | symbol): number;
  listenerCount(eventName: string | symbol): number;
  listenerCount(eventName: string | symbol): number;
  eventNames(): (string | symbol)[];
  eventNames(): (string | symbol)[];
  eventNames(): (string | symbol)[];
}
export class ExpressServerAbs implements Server {
  setTimeout(
    msecs?: number | undefined,
    callback?: (() => void) | undefined
  ): this;
  setTimeout(callback: () => void): this;
  maxHeadersCount: number | null;
  maxRequestsPerSocket: number | null;
  timeout: number;
  headersTimeout: number;
  keepAliveTimeout: number;
  requestTimeout: number;
  closeAllConnections(): void;
  closeIdleConnections(): void;
  addListener(event: string, listener: (...args: any[]) => void): this;
  addListener(event: 'close', listener: () => void): this;
  addListener(event: 'connection', listener: (socket: Socket) => void): this;
  addListener(event: 'error', listener: (err: Error) => void): this;
  addListener(event: 'listening', listener: () => void): this;
  addListener(event: 'checkContinue', listener: RequestListener): this;
  addListener(event: 'checkExpectation', listener: RequestListener): this;
  addListener(
    event: 'clientError',
    listener: (err: Error, socket: Duplex) => void
  ): this;
  addListener(
    event: 'connect',
    listener: (req: IncomingMessage, socket: Duplex, head: Buffer) => void
  ): this;
  addListener(event: 'request', listener: RequestListener): this;
  addListener(
    event: 'upgrade',
    listener: (req: IncomingMessage, socket: Duplex, head: Buffer) => void
  ): this;
  emit(event: string, ...args: any[]): boolean;
  emit(event: 'close'): boolean;
  emit(event: 'connection', socket: Socket): boolean;
  emit(event: 'error', err: Error): boolean;
  emit(event: 'listening'): boolean;
  emit(
    event: 'checkContinue',
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage }
  ): boolean;
  emit(
    event: 'checkExpectation',
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage }
  ): boolean;
  emit(event: 'clientError', err: Error, socket: Duplex): boolean;
  emit(
    event: 'connect',
    req: IncomingMessage,
    socket: Duplex,
    head: Buffer
  ): boolean;
  emit(
    event: 'request',
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & { req: IncomingMessage }
  ): boolean;
  emit(
    event: 'upgrade',
    req: IncomingMessage,
    socket: Duplex,
    head: Buffer
  ): boolean;
  on(event: string, listener: (...args: any[]) => void): this;
  on(event: 'close', listener: () => void): this;
  on(event: 'connection', listener: (socket: Socket) => void): this;
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'listening', listener: () => void): this;
  on(event: 'checkContinue', listener: RequestListener): this;
  on(event: 'checkExpectation', listener: RequestListener): this;
  on(
    event: 'clientError',
    listener: (err: Error, socket: Duplex) => void
  ): this;
  on(
    event: 'connect',
    listener: (req: IncomingMessage, socket: Duplex, head: Buffer) => void
  ): this;
  on(event: 'request', listener: RequestListener): this;
  on(
    event: 'upgrade',
    listener: (req: IncomingMessage, socket: Duplex, head: Buffer) => void
  ): this;
  once(event: string, listener: (...args: any[]) => void): this;
  once(event: 'close', listener: () => void): this;
  once(event: 'connection', listener: (socket: Socket) => void): this;
  once(event: 'error', listener: (err: Error) => void): this;
  once(event: 'listening', listener: () => void): this;
  once(event: 'checkContinue', listener: RequestListener): this;
  once(event: 'checkExpectation', listener: RequestListener): this;
  once(
    event: 'clientError',
    listener: (err: Error, socket: Duplex) => void
  ): this;
  once(
    event: 'connect',
    listener: (req: IncomingMessage, socket: Duplex, head: Buffer) => void
  ): this;
  once(event: 'request', listener: RequestListener): this;
  once(
    event: 'upgrade',
    listener: (req: IncomingMessage, socket: Duplex, head: Buffer) => void
  ): this;
  prependListener(event: string, listener: (...args: any[]) => void): this;
  prependListener(event: 'close', listener: () => void): this;
  prependListener(
    event: 'connection',
    listener: (socket: Socket) => void
  ): this;
  prependListener(event: 'error', listener: (err: Error) => void): this;
  prependListener(event: 'listening', listener: () => void): this;
  prependListener(event: 'checkContinue', listener: RequestListener): this;
  prependListener(event: 'checkExpectation', listener: RequestListener): this;
  prependListener(
    event: 'clientError',
    listener: (err: Error, socket: Duplex) => void
  ): this;
  prependListener(
    event: 'connect',
    listener: (req: IncomingMessage, socket: Duplex, head: Buffer) => void
  ): this;
  prependListener(event: 'request', listener: RequestListener): this;
  prependListener(
    event: 'upgrade',
    listener: (req: IncomingMessage, socket: Duplex, head: Buffer) => void
  ): this;
  prependOnceListener(event: string, listener: (...args: any[]) => void): this;
  prependOnceListener(event: 'close', listener: () => void): this;
  prependOnceListener(
    event: 'connection',
    listener: (socket: Socket) => void
  ): this;
  prependOnceListener(event: 'error', listener: (err: Error) => void): this;
  prependOnceListener(event: 'listening', listener: () => void): this;
  prependOnceListener(event: 'checkContinue', listener: RequestListener): this;
  prependOnceListener(
    event: 'checkExpectation',
    listener: RequestListener
  ): this;
  prependOnceListener(
    event: 'clientError',
    listener: (err: Error, socket: Duplex) => void
  ): this;
  prependOnceListener(
    event: 'connect',
    listener: (req: IncomingMessage, socket: Duplex, head: Buffer) => void
  ): this;
  prependOnceListener(event: 'request', listener: RequestListener): this;
  prependOnceListener(
    event: 'upgrade',
    listener: (req: IncomingMessage, socket: Duplex, head: Buffer) => void
  ): this;
  listen(
    port?: number | undefined,
    hostname?: string | undefined,
    backlog?: number | undefined,
    listeningListener?: (() => void) | undefined
  ): this;
  listen(
    port?: number | undefined,
    hostname?: string | undefined,
    listeningListener?: (() => void) | undefined
  ): this;
  listen(
    port?: number | undefined,
    backlog?: number | undefined,
    listeningListener?: (() => void) | undefined
  ): this;
  listen(
    port?: number | undefined,
    listeningListener?: (() => void) | undefined
  ): this;
  listen(
    path: string,
    backlog?: number | undefined,
    listeningListener?: (() => void) | undefined
  ): this;
  listen(path: string, listeningListener?: (() => void) | undefined): this;
  listen(
    options: ListenOptions,
    listeningListener?: (() => void) | undefined
  ): this;
  listen(
    handle: any,
    backlog?: number | undefined,
    listeningListener?: (() => void) | undefined
  ): this;
  listen(handle: any, listeningListener?: (() => void) | undefined): this;
  close(callback?: ((err?: Error | undefined) => void) | undefined): this;
  address(): string | AddressInfo | null;
  getConnections(cb: (error: Error | null, count: number) => void): void;
  ref(): this;
  unref(): this;
  maxConnections: number;
  connections: number;
  listening: boolean;
  removeListener(
    eventName: string | symbol,
    listener: (...args: any[]) => void
  ): this;
  removeListener(
    eventName: string | symbol,
    listener: (...args: any[]) => void
  ): this;
  removeListener(
    eventName: string | symbol,
    listener: (...args: any[]) => void
  ): this;
  off(eventName: string | symbol, listener: (...args: any[]) => void): this;
  off(eventName: string | symbol, listener: (...args: any[]) => void): this;
  off(eventName: string | symbol, listener: (...args: any[]) => void): this;
  removeAllListeners(event?: string | symbol | undefined): this;
  removeAllListeners(event?: string | symbol | undefined): this;
  removeAllListeners(event?: string | symbol | undefined): this;
  setMaxListeners(n: number): this;
  setMaxListeners(n: number): this;
  setMaxListeners(n: number): this;
  getMaxListeners(): number;
  getMaxListeners(): number;
  getMaxListeners(): number;
  listeners(eventName: string | symbol): Function[];
  listeners(eventName: string | symbol): Function[];
  listeners(eventName: string | symbol): Function[];
  rawListeners(eventName: string | symbol): Function[];
  rawListeners(eventName: string | symbol): Function[];
  rawListeners(eventName: string | symbol): Function[];
  listenerCount(eventName: string | symbol): number;
  listenerCount(eventName: string | symbol): number;
  listenerCount(eventName: string | symbol): number;
  eventNames(): (string | symbol)[];
  eventNames(): (string | symbol)[];
  eventNames(): (string | symbol)[];
}

export class ExpressAppAbs {
  init(): void;
  defaultConfiguration(): void;
  engine(
    ext: string,
    fn: (
      path: string,
      options: object,
      callback: (e: any, rendered?: string) => void
    ) => void
  ): this;
  set(setting: string, val: any): this;
  get: (name: string) => any;
  param(name: string | string[], handler: RequestParamHandler): this;
  param(callback: (name: string, matcher: RegExp) => RequestParamHandler): this;
  path(): string;
  enabled(setting: string): boolean;
  disabled(setting: string): boolean;
  enable(setting: string): this;
  disable(setting: string): this;
  render(
    name: string,
    options?: object,
    callback?: (err: Error, html: string) => void
  ): void;
  render(name: string, callback: (err: Error, html: string) => void): void;
  listen(
    port: number,
    hostname: string,
    backlog: number,
    callback?: () => void
  ): http.Server;
  listen(port: number, hostname: string, callback?: () => void): http.Server;
  listen(port: number, callback?: () => void): http.Server;
  listen(callback?: () => void): http.Server;
  listen(path: string, callback?: () => void): http.Server;
  listen(handle: any, listeningListener?: () => void): http.Server;
  router: string;
  settings: any;
  resource: any;
  map: any;
  locals: Record<string, any>;
  routes: any;
  _router: any;
  use: (key: string | Function, fn?: Function) => void;
  on: (event: string, callback: (parent: Application) => void) => this;
  mountpath: string | string[];
}
