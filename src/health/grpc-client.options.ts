import {ClientOptions, CustomStrategy, Transport} from '@nestjs/microservices';
import {join} from 'path';
import {ServerGrpc} from '../extend/grpc/server';

const options = {
    url: process.env.BIND_ADDRESS || '127.0.0.1:8080',
    package: 'grpc.health.v1',
    protoPath: join(__dirname, './health.proto')
};
export const grpcClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    options
};

export const grpcServerOptions: CustomStrategy = {
    strategy: new ServerGrpc(options),
};
