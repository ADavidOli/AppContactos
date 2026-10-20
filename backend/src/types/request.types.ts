import type { Request } from "express";
// express permite typar las peticiones http
// Request<Params, ResBody, ReqBody, ReqQuery>
export type Params<T> = Request<T>
export type Body<T> = Request<{},{},T>
export type Query<T> = Request<{},{},{},T>

// cuando se tienen varios en uno solo.
export type Req<TParams = {}, TBody ={}, TQuery={}> = Request<TParams, {}, TBody, TQuery>