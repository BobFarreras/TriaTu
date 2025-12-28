import { Candidate } from "../domain/entities/Candidate";

export interface CandidateRepository {
  add(roomId: string, userId: string, content: string): Promise<void>;
  getAllForRoom(roomId: string): Promise<Candidate[]>;
  deleteAllForRoom(roomId: string): Promise<void>;
  deleteById(candidateId: string, userId: string): Promise<void>;

}