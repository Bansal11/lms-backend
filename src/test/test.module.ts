import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestSchema } from './test.schema';
import { QuestionModule } from '../question/question.module';

@Module({
  imports: [
    // Import the MongooseModule to use the Test model
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
    QuestionModule, // Add the QuestionModule here
  ],
  providers: [TestService],
  controllers: [TestController]
})
export class TestModule {}
