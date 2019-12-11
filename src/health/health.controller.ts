import {Controller, Get, OnModuleInit} from '@nestjs/common';
import {Client, ClientGrpc, GrpcMethod} from '@nestjs/microservices';
import {Observable} from 'rxjs';
import {grpcClientOptions} from './grpc-client.options';
import {grpc} from './interfaces/compiled';
import ServingStatus = grpc.health.v1.HealthCheckResponse.ServingStatus;
import {
    HealthCheckRequest,
    HealthCheckResponse
} from 'grpc-ts-health-check';

export interface HealthService {
    check(data: HealthCheckRequest.AsObject): Observable<any>;
}

@Controller()
export class HealthController implements OnModuleInit {
    @Client(grpcClientOptions)
    private readonly client: ClientGrpc;

    private healthService: HealthService;

    onModuleInit() {
        this.healthService = this.client.getService<HealthService>('Health');
    }

    @Get('/version')
    version(): Observable<any> {
        return require('../../package.json').version;
    }

    @Get()
    execute(): Observable<any> {
        return this.healthService.check({service: 'whatever'});
    }

    @GrpcMethod('Health')
    Check(data: HealthCheckRequest.AsObject): HealthCheckResponse.AsObject {
        return {
            status: ServingStatus.SERVING
        };
    }
}
