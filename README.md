# grpc-health

> A grpc health check module

[![Build Status](https://travis-ci.com/Jeff-Tian/grpc-health.svg?branch=master)](https://travis-ci.com/Jeff-Tian/grpc-health)

![Usage example](https://cachenet-jeff-tian.cloud.okteto.net/http/https%3A%2F%2Fraw.githubusercontent.com%2FJeff-Tian%2Fnestjs-hero-grpc-sample-with-health-check%2Fmaster%2Fexample.jpeg)

## Installation

If you are using nest js 7, then 

```bash
npm i grpc-health --save
```

If you are still using nest js 6, then you should install the v1.3.2 for this package:

```bash
npm i grpc-health@1.3.2 --save
```

## Usage

### In nest js application:

Full example: https://github.com/Jeff-Tian/nestjs-hero-grpc-sample-with-health-check

#### with nest js 7

In your app module, import `HealthModule` 
```typescript
@Module({
  imports: [HealthModule.register(grpcClientOptions as GrpcOptions)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

In your `main.ts`, extend your grpc client options:

```typescript
import { extendedGrpcOptions } from 'grpc-health/dist/health/health-grpc-client.options';
import { GrpcOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  app.connectMicroservice(
    extendedGrpcOptions(grpcClientOptions as GrpcOptions),
  );
    
  await app.startAllMicroservicesAsync();
  await app.listen(3000, '0.0.0.0');
}

bootstrap();
```

#### with nest js 6
As when creating this package the `nest js` doesn't support multiple root namespaces of proto files, that is to say, all
 your proto
 files
should be packaged in the same `root namespace` such as `myService.xxx`: https://github.com/nestjs/nest/pull/1733

However, the standard `grpc health check` protocol is under package `grpc.health.v1`. This makes you embarrassment
when you want to utilize the `grpc_health_probe` in `kubernetes`.

Before [this PR](https://github.com/nestjs/nest/pull/1733) get merged, you can include this package into your
project to let your `nest js` support standard `grpc health check interfaces` with only a few code changes:

```typescript
// main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { grpcClientOptions } from "./grpc-client.options";
import {
  extendedGrpcOptions,
} from "grpc-health/dist/health/health-grpc-client.options";
import { GrpcOptions } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(
    extendedGrpcOptions(grpcClientOptions as GrpcOptions)
  );

  await app.startAllMicroservicesAsync();
  await app.listen(3001);
}

bootstrap();
```

Or if you are creating a hybrid application, the code change is as follows:

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { extendedGrpcOptions } from "grpc-health/dist/health/grpc-client.options";

async function bootstrap() {
  /**
   * Your original code might look like this:
   * const options = yourGrpcOptions;
   * Now wrap it with the extendedGrpcOptions method
   */
  const options = extendedGrpcOptions(yourGrpcOptions);
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(options);

  await app.startAllMicroservicesAsync();
  await app.listen(3001);
}

bootstrap();
```

Now you can add your own logic that implements the health check functionality, simply add a `HealthCheckController` and imports it from your `Module`:

```typescript
// health.controller.ts
import { Controller, Get, OnModuleInit } from "@nestjs/common";
import { Client, ClientGrpc, GrpcMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { grpcClientOptions } from "grpc-health/dist/health/grpc-client.options";
import { grpc } from "grpc-health/src/health/interfaces/compiled";
import ServingStatus = grpc.health.v1.HealthCheckResponse.ServingStatus;
import { HealthCheckRequest, HealthCheckResponse } from "grpc-ts-health-check";

export interface HealthService {
  check(data: HealthCheckRequest.AsObject): Observable<any>;
}

@Controller()
export class HealthController implements OnModuleInit {
  @Client(grpcClientOptions)
  private readonly client: ClientGrpc;

  private healthService: HealthService;

  onModuleInit() {
    this.healthService = this.client.getService<HealthService>("Health");
  }

  @Get("/version")
  version(): Observable<any> {
    return require("../../package.json").version;
  }

  @Get()
  execute(): Observable<any> {
    return this.healthService.check({ service: "whatever" });
  }

  @GrpcMethod("Health")
  Check(data: HealthCheckRequest.AsObject): HealthCheckResponse.AsObject {
    return {
      status: ServingStatus.SERVING
    };
  }
}
```

```typescript
// app.module.ts
import { Module } from "@nestjs/common";
import { HeroModule } from "./hero/hero.module";
import { HealthController } from "./health.controller";

@Module({
  imports: [HeroModule],
  controllers: [HealthController]
})
export class AppModule {}
```

All your other code remains the same!

You can also check out this repo: https://github.com/Jeff-Tian/nestjs-hero-grpc-sample-with-health-check, it includes
this
`grpc-health` package to the official `hero grpc app`.

## Gear with health check probe in kubernetes cluster

Now you can append the following to your deployment yaml file:

```yaml
  name: ...
  readinessProbe:
    exec:
      command: ["/bin/grpc_health_probe", "-addr=:5005"]
    initialDelaySeconds: 5
  livenessProbe:
    exec:
      command: ["/bin/grpc_health_probe", "-addr=:5005"]
    initialDelaySeconds: 10
  resources:...
```

## How

The main change to the original sample code is this commit:
https://github.com/Jeff-Tian/nestjs-hero-grpc-sample-with-health-check/commit/b76249ccf76d183143d55130825967d3bebe47de

## Development

```bash
git clone https://github.com/Jeff-Tian/grpc-health.git
cd grpc-health
npm i
npm test
```

## Support me

If you find this repo useful, you can [buy me a coffee](https://jeff-tian.jiwai.win/support-me):

[![Buy me a Coffee!](https://cachenet-jeff-tian.cloud.okteto.net/http/https%3A%2F%2Fapi.urlto.app%2Fv1%2Fscreenshoturl%2Fjpg%3Furl%3Dhttps%253A%252F%252Fjeff-tian.jiwai.win%252Fsupport-me%26fullpage%3Dtrue%26viewportwidth%3D1024%26viewportheight%3D1000%26ignorecache%3Dfalse%26region%3Dus)](https://jeff-tian.jiwai.win/support-me)
