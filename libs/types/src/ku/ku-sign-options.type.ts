import type { request } from 'undici';
import { HttpMethod } from '../common/http-method.const';


export type KuSignOptions = {
  method: HttpMethod,
  url: string,
  params?: object,
  body?: Awaited<ReturnType<typeof request>>['body'],
};
