import {
    Controller,
    Post,
    Body,
  } from '@nestjs/common';
  import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckerService } from './checker.service';
import { CheckDto } from './proxy.dto';
@ApiTags('Checker')
@Controller('checker')
export class CheckerController {
  constructor(private checkerService:CheckerService){}
  @Post()
  @ApiOperation({ summary: 'Check proxy' })
  
  add(@Body() proxy: string[]) {
    return this.checkerService.check(proxy);
  }
}
