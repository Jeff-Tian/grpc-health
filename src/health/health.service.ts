import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {HealthCheckRequest} from 'grpc-ts-health-check';
import {Observable} from 'rxjs';
import {ClientGrpc} from '@nestjs/microservices';

export interface IHealthService {
    check(data: HealthCheckRequest.AsObject): Observable<any>;
}

@Injectable()
export class HealthService implements OnModuleInit {
    private healthService: IHealthService;

    constructor(@Inject('HEALTH_PACKAGE') private client: ClientGrpc) {
    }

    onModuleInit() {
        this.healthService = this.client.getService<IHealthService>('Health');
    }

    check() {
        return this.healthService.check({service: 'whatever'});
    }
}
