import { Get, Controller } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TestEntity } from 'src/dataAccess/entity/test.entity';
import { TestService } from 'src/dataAccess/services/testService';

//@ApiBearerAuth()
@ApiTags('test')
@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  async findAll(): Promise<TestEntity[]> {
    return await this.testService.findAll();
  }
}
