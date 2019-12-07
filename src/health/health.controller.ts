import {Controller, Get, OnModuleInit} from '@nestjs/common';
import {Client, ClientGrpc, GrpcMethod} from '@nestjs/microservices';
import {Observable} from 'rxjs';
import {grpcClientOptions} from '../grpc-client.options';
import {grpc} from './interfaces/compiled';
import IHealthCheckRequest = grpc.health.v1.IHealthCheckRequest;
import ServingStatus = grpc.health.v1.HealthCheckResponse.ServingStatus;
import IHealthCheckResponse = grpc.health.v1.IHealthCheckResponse;

interface HealthService {
    check(data: IHealthCheckRequest): Observable<any>;
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
    Check(data: IHealthCheckRequest): IHealthCheckResponse {
        return {
            status: ServingStatus.SERVING
        };
    }
}
