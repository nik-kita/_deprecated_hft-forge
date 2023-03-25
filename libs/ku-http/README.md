# ku-http


* [`KuHttp` - the main accumulated type](../types/src/ku/http/ku-http.ts)

---

* [`SignGenerator`](./src/sign-generator.ts)
  * Most of the important http requests require `API_KEY` & `API_SECRET`
    * you should store them in `.production.env` (for tests `.test.env`)
  * This class should be invisible for client's code
* [`KuHttpService`](./src/ku-http.service.ts)
  > Is a service that provide simple usage for KuCoin Http API
* [`KuHttpModule`](./src/ku-http.module.ts)
  > Standard Nest.js module
