import {Injectable, OnApplicationShutdown} from '@nestjs/common';

@Injectable()
export class AppService implements OnApplicationShutdown {
    onApplicationShutdown(signal: string) {
        process.stdout.write('....... onApplicationShutdown ...... ' + signal, 'utf8');
    }
}
