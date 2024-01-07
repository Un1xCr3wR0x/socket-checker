import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { CheckDto } from './proxy.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class CheckerService {
    constructor(@InjectQueue('PROXIES') private readonly proxiesQueue: Queue) {}
  private readonly logger = new Logger(CheckerService.name);
  async check(proxies: string[]) {
    for (let i = 0; i < proxies.length; i++) {
      let proxy = proxies[i];
      this.proxiesQueue.add('CHECK_PROXY', {proxy,isLast: i === proxies.length - 1});
    }
    
  }
}
