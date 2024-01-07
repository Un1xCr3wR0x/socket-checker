import { ApiProperty } from '@nestjs/swagger';

export class CheckDto {
    @ApiProperty({ example: ['192.240.106.146:3128'] })
    proxy: string[];
  }
  