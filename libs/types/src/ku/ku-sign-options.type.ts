import { HttpMethod } from '../common/http-method.const';

export type KuSignOptions = {
  method: HttpMethod,
  endpoint: string,
  params?: object,
  body?: object,
};
