import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { grpc } from './interfaces/compiled';
import ServingStatus = grpc.health.v1.HealthCheckResponse.ServingStatus;
import { HealthCheckRequest, HealthCheckResponse } from 'grpc-ts-health-check';
import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('/version')
  version(): Observable<any> {
    return require('../../package.json').version;
  }

  @Get()
  execute(): Observable<any> {
    return this.healthService.check();
  }

  @GrpcMethod('Health')
  Check(data: HealthCheckRequest.AsObject): HealthCheckResponse.AsObject {
    return {
      status: ServingStatus.SERVING
    };
  }
}
