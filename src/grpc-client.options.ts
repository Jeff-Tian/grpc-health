import {ClientOptions, Transport} from '@nestjs/microservices';
import {join} from 'path';

export const grpcClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        url: process.env.BIND_ADDRESS || '0.0.0.0:8080',
        package: 'hero',
        protoPath: join(__dirname, './hero/hero.proto')
    }
};
