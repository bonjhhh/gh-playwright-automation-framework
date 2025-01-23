import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import logger from "../logger/logger";

class APIClient {
  private static client: AxiosInstance = axios.create({
    timeout: 10000, // 10 seconds timeout
  });

  static async get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      const response = await this.client.get(url, config);
      logger.info(`GET ${url} - Status: ${response.status}`);
      return response;
    } catch (error) {
      logger.error(`GET ${url} failed: ${this.getErrorMessage(error)}`);
      throw error;
    }
  }

  static async post(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      const response = await this.client.post(url, data, config);
      logger.info(`POST ${url} - Status: ${response.status}`);
      return response;
    } catch (error) {
      logger.error(`POST ${url} failed: ${this.getErrorMessage(error)}`);
      throw error;
    }
  }

  static async put(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      const response = await this.client.put(url, data, config);
      logger.info(`PUT ${url} - Status: ${response.status}`);
      return response;
    } catch (error) {
      logger.error(`PUT ${url} failed: ${this.getErrorMessage(error)}`);
      throw error;
    }
  }

  private static getErrorMessage(error: any): string {
    if (error.response) {
      return `Response: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
    } else if (error.request) {
      return "No response received from server.";
    } else {
      return `Error: ${error.message}`;
    }
  }
}

export default APIClient;