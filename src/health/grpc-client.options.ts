import {
    ClientOptions,
    CustomStrategy,
    GrpcOptions,
    Transport
} from '@nestjs/microservices';
import {join} from 'path';
import {ServerGrpc} from '../extend/grpc/server';
import R from 'ramda';

const options = {
    url: process.env.BIND_ADDRESS || '127.0.0.1:8080',
    package: 'grpc.health.v1',
    protoPath: join(__dirname, './health.proto')
};
export const grpcClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    options
};
export const extendedGrpcOptions = (
    clientOptions: GrpcOptions
): CustomStrategy => ({
    strategy: new ServerGrpc({
        ...clientOptions.options,
        package: clientOptions.options.package,
        packages: R.uniq([clientOptions.options.package, 'grpc.health.v1']),
        protoPath: clientOptions.options.protoPath,
        loader: {
            includeDirs: R.uniq([
                ...((clientOptions.options.loader || {}).includeDirs || []),
                join(__dirname, './health.proto')
            ])
        }
    })
});

export const grpcServerOptions = extendedGrpcOptions(grpcClientOptions);
