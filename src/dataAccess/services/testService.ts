import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestEntity } from '../entity/test.entity';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestEntity)
    private testRepository: Repository<TestEntity>,
  ) {}

  findAll(): Promise<TestEntity[]> {
    return this.testRepository.find();
  }

  findOne(id: number): Promise<TestEntity> {
    return this.testRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.testRepository.delete(id);
  }
}
