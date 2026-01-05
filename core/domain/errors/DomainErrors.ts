// src/core/domain/errors/DomainErrors.ts
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}

export class UnauthorizedAccessError extends DomainError {
  constructor(resource: string, userId: string) {
    super(`L'usuari ${userId} no té permís per accedir al recurs: ${resource}`);
    this.name = "UnauthorizedAccessError";
  }
}

export class ResourceNotFoundError extends DomainError {
  constructor(resource: string, id: string) {
    super(`Recurs ${resource} amb ID ${id} no trobat.`);
    this.name = "ResourceNotFoundError";
  }
}