import GrpcClient from 'grpc-man/lib/Client';
import {join} from 'path';
import {spawn} from 'child_process';
import {sleep} from '@jeff-tian/sleep';

jest.setTimeout(30000);

describe('Hero', () => {
    let childProcess;
    beforeAll(async () => {
        const res = await new Promise((resolve, reject) => {
            console.log('spawning...');
            childProcess = spawn('npm', ['start'], {
                detached: true,
                shell: true,
                windowsHide: false
            });
            console.log('spawned.');
            childProcess.stdout.on('data', resolve);
            childProcess.stderr.on('data', reject);
        });

        await sleep(5);
        console.log('started...', res.toString());
    });

    afterAll(() => childProcess.kill());

    it('gets hero', async () => {
        const client = new GrpcClient(
            '0.0.0.0:8080',
            join(__dirname, 'hero.proto')
        );

        const res = await client.grpc.hero.HeroService.FindOne({id: 1});
        expect(res).toEqual({id: 1, name: 'John'});
    });
});
