// ✅ CORRECCIÓ: Afegim 'beforeEach' a l'import
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AddCandidate } from '@/core/usecases/candidates/AddCandidate';
import { CandidateRepository } from '@/core/ports/CandidateRepository';

describe('AddCandidate UseCase', () => {
  let useCase: AddCandidate;
  let mockRepo: CandidateRepository;

  beforeEach(() => {
    mockRepo = {
      add: vi.fn(),
      getAllForRoom: vi.fn(),
      deleteAllForRoom: vi.fn(),
    };
    useCase = new AddCandidate(mockRepo);
  });

  it('should add a valid candidate', async () => {
    await useCase.execute('room-1', 'user-1', 'Pizza');
    expect(mockRepo.add).toHaveBeenCalledWith('room-1', 'user-1', 'Pizza');
  });

  it('should throw error if content is empty', async () => {
    await expect(useCase.execute('room-1', 'user-1', '   '))
      .rejects.toThrow('Content cannot be empty');
    expect(mockRepo.add).not.toHaveBeenCalled();
  });
});