import { Controller, Get, Path, Response, Route, Tags } from "tsoa";
import { candidateService } from "../services/candidateService.ts";

@Route("candidates")
@Tags("Candidates")
export class CandidatesController extends Controller {
  @Get("/:id")
  @Response(500, "Internal Server Error")
  public async retrieve(@Path() id: string) {
    return await candidateService.getById(id);
  }
}
