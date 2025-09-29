import {getCandidateById} from "../repositories/candidateRepository.ts";

export class CandidateService {
  async getById(id: string) {
    return getCandidateById(id);
  }
}

export const candidateService = new CandidateService();
