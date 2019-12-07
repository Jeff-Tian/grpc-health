import {Module} from '@nestjs/common';
import {HealthModule} from './health/health.module';
import {AppService} from './app.service';

@Module({
    imports: [HealthModule],
    providers: [AppService]
})
export class AppModule {
}
