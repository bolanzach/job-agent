import {
  createCompany,
  CreateCompanyParams,
  getCompanyById,
  getCompanyContext,
  listCompanies,
  updateCompany,
  updateCompanyContext,
  UpdateCompanyParams,
} from "../repositories/companyRepository.ts";

export class CompanyService {
  async listCompanies() {
    return await listCompanies();
  }

  async getCompanyById(id: string) {
    return await getCompanyById(id);
  }

  async createCompany(params: CreateCompanyParams) {
    return await createCompany(params);
  }

  async updateCompany(params: UpdateCompanyParams) {
    return await updateCompany(params);
  }

  async updateCompanyContext(companyId: string, context: string) {
    const params = {
      companyId,
      context,
    };
    return await updateCompanyContext(params);
  }

  async getCompanyContext(companyId: string) {
    return await getCompanyContext(companyId);
  }
}

export const companyService = new CompanyService();
