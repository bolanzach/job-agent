import {
  createMatch,
  CreateMatchParams,
} from "../repositories/candidateJobMatchRepository.ts";

export type ListCandidateJobMatchesRequest = {
  candidateId: string;
};

export class CandidateJobMatchesService {
  async create(params: CreateMatchParams) {
    return createMatch(params);
  }
}

export const candidateJobMatchService = new CandidateJobMatchesService();
