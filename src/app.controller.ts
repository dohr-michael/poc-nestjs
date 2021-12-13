import { Controller, Get } from '@nestjs/common';
import { Db } from 'mongodb';

@Controller()
export class AppController {
  @Get('@/health')
  async health() {
    return {
      'status': 'ok',
    };
  }
}
