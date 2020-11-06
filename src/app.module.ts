import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AppService } from './app.service';
import { healthGrpcClientOptions } from './health/health-grpc-client.options';
import {GrpcOptions} from '@nestjs/microservices';

@Module({
  imports: [HealthModule.register(healthGrpcClientOptions as GrpcOptions)],
  providers: [AppService]
})
export class AppModule {}
