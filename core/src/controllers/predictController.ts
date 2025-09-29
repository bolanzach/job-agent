import { Controller, Post, Route, Body, Tags, Response } from "tsoa";
import type { CrawlRequest } from "../services/crawlService/index.ts";
import {crawlService} from "../services/crawlService/index.ts";

interface CrawlResponse {
  success: boolean;
  data?: Record<string, any[]>;
  error?: string;
}

@Route("predict")
@Tags("Predict")
export class PredictController extends Controller {


}
