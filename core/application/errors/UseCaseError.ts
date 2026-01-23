export type UseCaseErrorContext = {
  feature: string;
  useCase: string;
  code?: string;
};

export class UseCaseError extends Error {
  readonly feature: string;
  readonly useCase: string;
  readonly code?: string;
  readonly cause?: unknown;

  constructor(message: string, context: UseCaseErrorContext, cause?: unknown) {
    super(message);
    this.name = 'UseCaseError';
    this.feature = context.feature;
    this.useCase = context.useCase;
    this.code = context.code;
    this.cause = cause;
  }

  static wrap(feature: string, useCase: string, error: unknown, code?: string): UseCaseError {
    if (error instanceof UseCaseError) return error;
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return new UseCaseError(message, { feature, useCase, code }, error);
  }
}
