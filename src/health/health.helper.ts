import { resolve } from 'path';

export default class GrpcHealthCheckHelper {
  static getHealthCheckProtoPath() {
    return resolve(__dirname, './health.proto');
  }
}
