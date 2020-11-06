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
): CustomStrategy => {
    const pack = clientOptions.options.package;
    const packages = pack instanceof Array ? pack : [pack];

    const protoPath = clientOptions.options.protoPath;
    const protoPaths = protoPath instanceof Array ? protoPath : [protoPath];

    // The following line breaks the purity, but it is needed to let health controller
    // to know that the original grpc options has been extended
    grpcClientOptions.options = clientOptions.options;

    return ({
        strategy: new ServerGrpc({
            ...clientOptions.options,
            packages: R.uniq([...packages, 'grpc.health.v1']),
            protoPaths: R.uniq([...protoPaths, join(__dirname, './health.proto')]),
            loader: {
                includeDirs: R.uniq([
                    ...((clientOptions.options.loader || {}).includeDirs || []),
                    join(__dirname, './health.proto')
                ])
            }
        })
    });
};

export const grpcServerOptions = extendedGrpcOptions(grpcClientOptions);
