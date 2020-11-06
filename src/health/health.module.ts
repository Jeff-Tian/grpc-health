import { DynamicModule, Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import {
  ClientsModule,
  GrpcOptions,
  Transport
} from '@nestjs/microservices';
import { HealthService } from './health.service';
import { healthClientOptions } from './health-grpc-client.options';

@Module({})
export class HealthModule {
  static register(grpcClientOptions: GrpcOptions): DynamicModule {
    return {
      imports: [
        ClientsModule.register([
          {
            name: 'HEALTH_PACKAGE',
            transport: Transport.GRPC,
            options: {
              ...healthClientOptions,
              url: grpcClientOptions.options.url
            }
          }
        ])
      ],
      module: HealthModule,
      providers: [HealthService],
      controllers: [HealthController]
    };
  }
}
