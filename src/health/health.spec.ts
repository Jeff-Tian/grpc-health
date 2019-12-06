import GrpcClient from 'grpc-man/lib/Client';
import {join} from 'path';
import {spawn} from 'child_process';
import {sleep} from '@jeff-tian/sleep';
import {grpc} from './interfaces/compiled';
import ServingStatus = grpc.health.v1.HealthCheckResponse.ServingStatus;

jest.setTimeout(30000);

describe('Health Check', () => {
    let childProcess;
    beforeAll(async () => {
        const res = await new Promise((resolve, reject) => {
            childProcess = spawn('npm', ['start'], {
                detached: true,
                shell: true,
                windowsHide: false
            });
            childProcess.stdout.on('data', (data: Buffer) => {
                console.log(data.toString());
                resolve(data);
            });
            childProcess.stderr.on('data', (data: Buffer) => {
                console.error(data.toString());
                reject(data);
            });
        });

        await sleep(8);
    });

    afterAll(() => {
        console.log('done testing!');
        childProcess.stdin.pause();
        childProcess.kill('SIGKILL');
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
