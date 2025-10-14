import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Put,
  Response,
  Route,
  Tags,
} from "tsoa";
import { companyService } from "../services/companyService.ts";
import type { CreateCompanyParams } from "../repositories/companyRepository.ts";

interface UpdateCompanyContextRequest {
  context: string;
}

@Route("companies")
@Tags("Companies")
export class CompaniesController extends Controller {
  @Get("/")
  @Response(500, "Internal Server Error")
  public async list() {
    return await companyService.listCompanies();
  }

  @Post("/")
  public async create(@Body() params: CreateCompanyParams) {
    return await companyService.createCompany(params);
  }

  @Get("/:id")
  public async retrieve(@Path() id: string) {
    return await companyService.getCompanyById(id);
  }

  @Put("/:id")
  public async update(
    @Path() id: string,
    @Body() request: { website: string },
  ) {
    return await companyService.updateCompany({
      companyId: id,
      website: request.website,
    });
  }

  @Put("/:id/context")
  public async updateContext(
    @Path() id: string,
    @Body() request: UpdateCompanyContextRequest,
  ) {
    return await companyService.updateCompanyContext(id, request.context);
  }

  @Get("/:id/context")
  public async getContext(@Path() id: string) {
    return await companyService.getCompanyContext(id);
  }
}
