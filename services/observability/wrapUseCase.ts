import { UseCaseError } from '@/core/application/errors/UseCaseError';

type UseCaseWithExecute = {
  execute: (...args: any[]) => Promise<any>;
};

export function wrapUseCase<T extends UseCaseWithExecute>(
  feature: string,
  useCase: string,
  instance: T
): T {
  type Args = Parameters<T['execute']>;
  type Result = Awaited<ReturnType<T['execute']>>;

  return new Proxy(instance, {
    get(target, prop, receiver) {
      if (prop === 'execute') {
        return (async (...args: Args): Promise<Result> => {
          try {
            return await target.execute(...args);
          } catch (error) {
            throw UseCaseError.wrap(feature, useCase, error);
          }
        }) as T['execute'];
      }

      return Reflect.get(target, prop, receiver);
    }
  });
}
