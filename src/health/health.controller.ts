import { Controller, Get } from '@nestjs/common';
import { 
    DiskHealthIndicator, 
    HealthCheck, 
    HealthCheckService, 
    HttpHealthIndicator, 
    MemoryHealthIndicator,
    MongooseHealthIndicator
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {

    constructor(
        private healthService: HealthCheckService,
        private http: HttpHealthIndicator,
        private disk: DiskHealthIndicator,
        private memory: MemoryHealthIndicator,
        private db: MongooseHealthIndicator,
    ) {}

    @Get('/docs')
    @HealthCheck()
    public check() {

        return this.healthService.check([
            () => this.http.pingCheck('api-docs', `http://${'localhost'}:${process.env.PORT}/api/v1/docs`),
            () => this.http.responseCheck(
                'api-docs',
                `http://${'localhost'}:${process.env.PORT}/api/v1/docs`, 
                (res) => res.status === 200
            ),
        ])
    }

    @Get('db')
    @HealthCheck()
    public dbCheck() {

        return this.healthService.check([
            () => this.db.pingCheck('mogoose')
        ])
    }

    @Get('/machine')
    @HealthCheck()
    public machineCheck() {
        
        return this.healthService.check([
            () => this.disk.checkStorage( 'storage', { path: '/', thresholdPercent: 0.5 }),
            () => this.memory.checkHeap('memory-heap', 150 * 1024 * 1024),
            () => this.memory.checkRSS('memory-rss', 150 * 1024 * 1024)
        ])
    }
}
