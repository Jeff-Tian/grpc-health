import GrpcClient from 'grpc-man/lib/Client';
import {join} from 'path';
import {ChildProcess, spawn} from 'child_process';
import {sleep} from '@jeff-tian/sleep';
import {grpc} from './interfaces/compiled';
import ServingStatus = grpc.health.v1.HealthCheckResponse.ServingStatus;
import {ShutdownSignal} from '@nestjs/common';

jest.setTimeout(30000);

describe('Health Check', () => {
    let childProcess: ChildProcess;
    beforeAll(async () => {
        const res = await new Promise((resolve, reject) => {
            childProcess = spawn('npm', ['start'], {
                detached: true,
                shell: true,
                windowsHide: false
            });
            childProcess.stdout.on('data', (data: Buffer) => {
                process.stdout.write(data);
                resolve(data);
            });
            childProcess.stderr.on('data', (data: Buffer) => {
                process.stderr.write(data);
                reject(data);
            });
            childProcess.on('exit', (code, signal) => {
                // process.stdout.write('ahhh, dying... ' + code + ', ' + signal, 'utf8');

                setTimeout(() => {
                    process.exit(code);
                }, 3000);
            });
            childProcess.on('uncaughtException', (e) => {
                process.stderr.write(e.stack, 'utf8');
            });
        });

        await sleep(5);
    });

    afterAll(async () => {
        console.log('done testing!');
        childProcess.kill(ShutdownSignal.SIGINT);
        console.log('killed');
    });

    it('checks', async () => {
        const client = new GrpcClient(
            '0.0.0.0:8080',
            join(__dirname, 'health.proto')
        );

        const res = await client.grpc.grpc.health.v1.Health.Check({service: 'whatever'});
        expect(res).toEqual({status: ServingStatus[ServingStatus.SERVING]});
    });
});
