import { Controller, Get, Path, Post, Route, Body, Tags, Response } from "tsoa";
import {companyService} from "../services/companyService.ts";


@Route("companies")
@Tags("Companies")
export class CompaniesController extends Controller {

  @Get("/")
  @Response(500, "Internal Server Error")
  public async list() {
    return await companyService.listCompanies();
  }

  @Get("/:id")
  public async retrieve(@Path() id: string) {
    return await companyService.getCompanyById(id);
  }
}
