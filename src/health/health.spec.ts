import GrpcClient from 'grpc-man/lib/Client';
import {join} from 'path';
import {ChildProcess, fork, spawn} from 'child_process';
import {sleep} from '@jeff-tian/sleep';
import {grpc} from './interfaces/compiled';
import ServingStatus = grpc.health.v1.HealthCheckResponse.ServingStatus;

jest.setTimeout(30000);

describe('Health Check', () => {
    let childProcess: ChildProcess;
    beforeAll(async () => {
        await new Promise((resolve, reject) => {
            childProcess = spawn('npm', ['start'], {
                detached: true,
            });
            childProcess.stdout.on('data', (data: Buffer) => {
                process.stdout.write(data);
                resolve(data);
            });
            childProcess.stderr.on('data', (data: Buffer) => {
                process.stderr.write(data);
                reject(data);
            });
        });

        await sleep(5);
        console.log('nest application started.');
        childProcess.on('exit', (code, signal) => {
            process.stdout.write('child process exited with ' +
                `code ${code} and signal ${signal}\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`);
        });
        childProcess.stdout.on('data', (data: Buffer) => {
            process.stdout.write(data);
        });
        childProcess.stderr.on('data', (data: Buffer) => {
            process.stderr.write(data);
        });
    });

    afterAll(async () => {
        console.log('done testing!');
        process.kill(-childProcess.pid);
        await sleep(2);
        console.log('killed = ', childProcess.killed);
    });

    it('checks', async () => {
        const client = new GrpcClient(
            '127.0.0.1:8080',
            join(__dirname, 'health.proto')
        );

        const res = await client.grpc.grpc.health.v1.Health.Check({
            service: 'whatever'
        });
        expect(res).toEqual({status: ServingStatus[ServingStatus.SERVING]});
    });
});
