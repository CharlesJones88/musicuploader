export type Handler<T> = {
  handler(request: T): Response | Promise<Response>;
}['handler'];

export type Methods = keyof Routes[string];

export type Request<Path = unknown, Query = unknown, Hash = unknown> = {
  hash: Hash;
  method: string;
  path: Path;
  query: Query;
  signal: AbortSignal;
  url: string;
} & Body;

export type Routes = Record<
  string,
  {
    '*'?: Handler<Request>;
    get?: Handler<Request>;
    post?: Handler<Request>;
    put?: Handler<Request>;
    delete?: Handler<Request>;
    patch?: Handler<Request>;
    options?: Handler<Request>;
    head?: Handler<Request>;
  }
>;

export const router = {
  _routes: {} as Routes,
  all<Path = unknown, Query = unknown, Hash = unknown>(
    route: string,
    handler: (
      request: Request<Path, Query, Hash>,
    ) => Response | Promise<Response>,
  ) {
    this._routes[route] = { ...(this._routes[route] ?? {}), '*': handler };
  },
  get<Path = void, Query = void, Hash = void>(
    route: string,
    handler: (
      request: Request<Path, Query, Hash>,
    ) => Response | Promise<Response>,
  ) {
    this._routes[route] = { ...(this._routes[route] ?? {}), get: handler };
  },
  post<Path = void, Query = void, Hash = void>(
    route: string,
    handler: (
      request: Request<Path, Query, Hash>,
    ) => Response | Promise<Response>,
  ) {
    this._routes[route] = { ...(this._routes[route] ?? {}), post: handler };
  },
  put<Path = void, Query = void, Hash = void>(
    route: string,
    handler: (
      request: Request<Path, Query, Hash>,
    ) => Response | Promise<Response>,
  ) {
    this._routes[route] = { ...(this._routes[route] ?? {}), put: handler };
  },
  delete<Path = void, Query = void, Hash = void>(
    route: string,
    handler: (
      request: Request<Path, Query, Hash>,
    ) => Response | Promise<Response>,
  ) {
    this._routes[route] = { ...(this._routes[route] ?? {}), delete: handler };
  },
  patch<Path = void, Query = void, Hash = void>(
    route: string,
    handler: (
      request: Request<Path, Query, Hash>,
    ) => Response | Promise<Response>,
  ) {
    this._routes[route] = { ...(this._routes[route] ?? {}), patch: handler };
  },
  options<Path = void, Query = void, Hash = void>(
    route: string,
    handler: (
      request: Request<Path, Query, Hash>,
    ) => Response | Promise<Response>,
  ) {
    this._routes[route] = {
      ...(this._routes[route] ?? {}),
      options: handler,
    };
  },
  head<Path = void, Query = void, Hash = void>(
    route: string,
    handler: (
      request: Request<Path, Query, Hash>,
    ) => Response | Promise<Response>,
  ) {
    this._routes[route] = { ...(this._routes[route] ?? {}), head: handler };
  },
};
