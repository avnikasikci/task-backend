import { TestEntity } from './../entity/test.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TestEntity])],
  exports: [TypeOrmModule],
})
export class TestModule {}
