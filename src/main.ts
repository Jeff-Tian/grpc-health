import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {grpcServerOptions} from './health/health-grpc-client.options';

async function bootstrap() {
    /**
     * This example contains a hybrid application (HTTP + gRPC)
     * You can switch to a microservice with NestFactory.createMicroservice() as follows:
     *
     * const app = await NestFactory.createMicroservice(AppModule, {
     *  transport: Transport.GRPC,
     *  options: {
     *    package: 'hero',
     *    protoPath: join(__dirname, './hero/hero.proto'),
     *  }
     * });
     * await app.listenAsync();
     *
     */
    const app = await NestFactory.create(AppModule);
    app.connectMicroservice(grpcServerOptions);

    app.enableShutdownHooks();
    await app.startAllMicroservicesAsync();
    await app.listen(process.env.HTTP_PORT || 3001);
}

bootstrap();
