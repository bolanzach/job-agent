import {getCompanyById, listCompanies} from "../repositories/companyRepository.ts";

export class CompanyService {
  async listCompanies() {
    return await listCompanies()
  }

  async getCompanyById(id: string) {
    return await getCompanyById(id);
  }
}

export const companyService = new CompanyService();
