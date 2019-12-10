import GrpcClient from 'grpc-man/lib/Client';
import {join} from 'path';
import {ChildProcess, spawn, spawnSync} from 'child_process';
import {grpc} from './interfaces/compiled';
import ServingStatus = grpc.health.v1.HealthCheckResponse.ServingStatus;
import {sleep} from '@jeff-tian/sleep';

jest.setTimeout(50000);

describe('Health Check', () => {
    let childProcess: ChildProcess;
    beforeAll(async () => {
        childProcess = spawn('npm', ['start'], {
            detached: true // Trick: detached set to true to allow later kill -pid works
        });

        let {output} = {output: null};
        let count = 0;

        while (!output || output.filter(o => o && o.trim(' ', '\r\n').length > 0).length === 0) {
            console.log('waiting to start testing... ', count++);
            await sleep(1);
            output = spawnSync('lsof', ['-i:3001'], {encoding: 'utf8'}).output;
        }

        console.log('output = ', output.join('\n'));
        console.log('started testing...');
    });

    afterAll(async () => {
        // Trick: -pid is to kill all sub processes that created by nest
        // to prevent the error: Some handles are still open to prevent
        // Jest to quit
        process.kill(-childProcess.pid);
        await sleep(1);
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
