import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import axios from 'axios';
import { Job } from 'bull';
import { HttpProxyAgent } from 'http-proxy-agent';
import { lookup } from 'fast-geoip';
import { WebsocketGateway } from 'src/websocket-gateway/websocket.gateway';

@Processor('PROXIES')
export class CheckerProcesspr {
  private readonly logger = new Logger(CheckerProcesspr.name);
  constructor(private websocketGatway: WebsocketGateway) { }
  @Process({
    name: 'CHECK_PROXY',
    concurrency: 250,
  })
  async scrapLink(job: Job<any>) {
    console.log(job.data)
    return await this.httpChecker(job.data.proxy, job.data.isLast);
  }

  async httpChecker(proxy: string, isLast: boolean) {
    const httpAgent = new HttpProxyAgent(`http://${proxy}`);
    const startTime: any = new Date();

    try {
      const res = await axios.get('http://httpbin.org/get?show_env', {
        httpAgent,
        timeout: 3000,
      });
      const endTime: any = new Date();
      const latency = endTime - startTime;
      if (res.data) {
        let geo = await lookup(proxy.split(':')[0])
        let proxyData = {
          proxy,
          data: {
            status: 'LIVE',
            latency: `${latency} ms`,
            type: res.data.headers['X-Forwarded-Proto'],
            geo: { ...geo }
          }

        }
        this.websocketGatway.handleMessage(proxyData)
        if (isLast) {
          this.websocketGatway.handleMessage({
            status: 'DONE',
          })
        }
        return proxyData
      }
      this.websocketGatway.handleMessage({
        proxy,
        data : {
          status: 'DEAD',
        }
      })
      if (isLast) {
        this.websocketGatway.handleMessage({
          status: 'DONE',
        })
      }
      return { proxy, status: 'DEAD' };
    } catch (error) {
      this.websocketGatway.handleMessage({
        proxy,
        data : {
          status: 'DEAD',
        }
      })
      if (isLast) {
        this.websocketGatway.handleMessage({
          status: 'DONE',
        })
      }
      return { proxy, status: 'DEAD' };
    }

  }

}
