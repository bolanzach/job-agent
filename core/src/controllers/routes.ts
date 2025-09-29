/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PredictController } from './predictController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CandidateJobMatchesController } from './candiateJobMatchesController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CompaniesController } from './companiesController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CrawlController } from './crawlController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { JobPostingsController } from './jobPostingsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CandidatesController } from './candidatesController';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "CandidateJobMatch": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "candidate_profile_id": {"dataType":"string","required":true},
            "job_post_id": {"dataType":"string","required":true},
            "match_score": {"dataType":"double","required":true},
            "match_details": {"dataType":"string","required":true},
            "created_at": {"dataType":"string","required":true},
            "updated_at": {"dataType":"string","required":true},
            "deleted_at": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_CandidateJobMatch.Exclude_keyofCandidateJobMatch.id-or-created_at-or-deleted_at-or-updated_at__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"candidate_profile_id":{"dataType":"string","required":true},"job_post_id":{"dataType":"string","required":true},"match_score":{"dataType":"double","required":true},"match_details":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_CandidateJobMatch.id-or-created_at-or-deleted_at-or-updated_at_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_CandidateJobMatch.Exclude_keyofCandidateJobMatch.id-or-created_at-or-deleted_at-or-updated_at__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateMatchParams": {
        "dataType": "refAlias",
        "type": {"ref":"Omit_CandidateJobMatch.id-or-created_at-or-deleted_at-or-updated_at_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Company": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "website": {"dataType":"string","required":true},
            "created_at": {"dataType":"string","required":true},
            "deleted_at": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JobPosting": {
        "dataType": "refObject",
        "properties": {
            "url": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "text": {"dataType":"string","required":true},
            "raw_text": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.JobPosting-Array_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"array","array":{"dataType":"refObject","ref":"JobPosting"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CrawlResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "data": {"ref":"Record_string.JobPosting-Array_"},
            "error": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CrawlRequest": {
        "dataType": "refObject",
        "properties": {
            "companyIds": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "useJavaScript": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JobPost": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "url": {"dataType":"string","required":true},
            "company_id": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "content": {"dataType":"string","required":true},
            "created_at": {"dataType":"string","required":true},
            "deleted_at": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_CreateJobPostParams.Exclude_keyofCreateJobPostParams.id__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"url":{"dataType":"string","required":true},"company_id":{"dataType":"string","required":true},"title":{"dataType":"string","required":true},"content":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_CreateJobPostParams.id_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_CreateJobPostParams.Exclude_keyofCreateJobPostParams.id__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_UpdateJobPostContextParams.context-or-jobFunction_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"context":{"dataType":"string","required":true},"jobFunction":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateJobPostContextRequest": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_UpdateJobPostContextParams.context-or-jobFunction_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CandidateProfile": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "resume": {"dataType":"string"},
            "job_function": {"dataType":"string","required":true},
            "created_at": {"dataType":"string","required":true},
            "updated_at": {"dataType":"string","required":true},
            "deleted_at": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsCandidateJobMatchesController_retrieve: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"body","name":"req","required":true,"ref":"CreateMatchParams"},
        };
        app.post('/api/candidate-job-matches',
            ...(fetchMiddlewares<RequestHandler>(CandidateJobMatchesController)),
            ...(fetchMiddlewares<RequestHandler>(CandidateJobMatchesController.prototype.retrieve)),

            async function CandidateJobMatchesController_retrieve(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCandidateJobMatchesController_retrieve, request, response });

                const controller = new CandidateJobMatchesController();

              await templateService.apiHandler({
                methodName: 'retrieve',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCompaniesController_list: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/api/companies',
            ...(fetchMiddlewares<RequestHandler>(CompaniesController)),
            ...(fetchMiddlewares<RequestHandler>(CompaniesController.prototype.list)),

            async function CompaniesController_list(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCompaniesController_list, request, response });

                const controller = new CompaniesController();

              await templateService.apiHandler({
                methodName: 'list',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCompaniesController_retrieve: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/api/companies/:id',
            ...(fetchMiddlewares<RequestHandler>(CompaniesController)),
            ...(fetchMiddlewares<RequestHandler>(CompaniesController.prototype.retrieve)),

            async function CompaniesController_retrieve(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCompaniesController_retrieve, request, response });

                const controller = new CompaniesController();

              await templateService.apiHandler({
                methodName: 'retrieve',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCrawlController_crawlJobPostsForCompanies: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"body","name":"request","required":true,"ref":"CrawlRequest"},
        };
        app.post('/api/crawl/jobs',
            ...(fetchMiddlewares<RequestHandler>(CrawlController)),
            ...(fetchMiddlewares<RequestHandler>(CrawlController.prototype.crawlJobPostsForCompanies)),

            async function CrawlController_crawlJobPostsForCompanies(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCrawlController_crawlJobPostsForCompanies, request, response });

                const controller = new CrawlController();

              await templateService.apiHandler({
                methodName: 'crawlJobPostsForCompanies',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsJobPostingsController_list: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/api/job-posts/:id',
            ...(fetchMiddlewares<RequestHandler>(JobPostingsController)),
            ...(fetchMiddlewares<RequestHandler>(JobPostingsController.prototype.list)),

            async function JobPostingsController_list(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsJobPostingsController_list, request, response });

                const controller = new JobPostingsController();

              await templateService.apiHandler({
                methodName: 'list',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsJobPostingsController_create: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"body","name":"params","required":true,"ref":"Omit_CreateJobPostParams.id_"},
        };
        app.post('/api/job-posts',
            ...(fetchMiddlewares<RequestHandler>(JobPostingsController)),
            ...(fetchMiddlewares<RequestHandler>(JobPostingsController.prototype.create)),

            async function JobPostingsController_create(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsJobPostingsController_create, request, response });

                const controller = new JobPostingsController();

              await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsJobPostingsController_updateContext: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                params: {"in":"body","name":"params","required":true,"ref":"UpdateJobPostContextRequest"},
        };
        app.put('/api/job-posts/:id/context',
            ...(fetchMiddlewares<RequestHandler>(JobPostingsController)),
            ...(fetchMiddlewares<RequestHandler>(JobPostingsController.prototype.updateContext)),

            async function JobPostingsController_updateContext(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsJobPostingsController_updateContext, request, response });

                const controller = new JobPostingsController();

              await templateService.apiHandler({
                methodName: 'updateContext',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsJobPostingsController_getContext: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/api/job-posts/:id/context',
            ...(fetchMiddlewares<RequestHandler>(JobPostingsController)),
            ...(fetchMiddlewares<RequestHandler>(JobPostingsController.prototype.getContext)),

            async function JobPostingsController_getContext(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsJobPostingsController_getContext, request, response });

                const controller = new JobPostingsController();

              await templateService.apiHandler({
                methodName: 'getContext',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCandidatesController_retrieve: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/api/candidates/:id',
            ...(fetchMiddlewares<RequestHandler>(CandidatesController)),
            ...(fetchMiddlewares<RequestHandler>(CandidatesController.prototype.retrieve)),

            async function CandidatesController_retrieve(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCandidatesController_retrieve, request, response });

                const controller = new CandidatesController();

              await templateService.apiHandler({
                methodName: 'retrieve',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
