// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TAsyncFunction = (...args: any[]) => Promise<any>;

export interface IApi {
  queryKey: string[];
  endpoints: {
    [key: string]: TAsyncFunction;
  };
}

export interface IEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}
