import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Response,
  Route,
  Tags,
} from "tsoa";
import type { ListCandidateJobMatchesRequest } from "../services/candidateJobMatchesService.ts";
import { candidateJobMatchService } from "../services/candidateJobMatchesService.ts";
import type { CreateMatchParams } from "../repositories/candidateJobMatchRepository.ts";

@Route("candidate-job-matches")
@Tags("Candidates and Jobs Matches")
export class CandidateJobMatchesController extends Controller {
  @Post("/")
  @Response(500, "Internal Server Error")
  public async retrieve(@Body() req: CreateMatchParams) {
    return await candidateJobMatchService.create(req);
  }

  // @Get("/")
  // public async list(@Query() req: ListCandidateJobMatchesRequest) {
  //   throw new Error('Not Implemented')
  // }
}
