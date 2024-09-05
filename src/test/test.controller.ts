import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { TestService } from './test.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuestionService } from 'src/question/question.service';

@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService, private questionService: QuestionService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard) // Admin only
  async createTest(@Body() test: { 
    title: string; 
    description: string;
    questions: string[];
    uniqueURL: string;
  }) {

    if (!test.title) {
      return { error: 'Title is required' };
    }

    if (!test.description) {
      return { error: 'Description is required' };
    }

    // check if the questions array contains only 1 question with 5 difficulty only then create the test
    if (test.questions.length !== 1) {
      return { error: 'Only one question is allowed' };
    } else {
      const questionId = test.questions[0];
      const question = await this.questionService.findOne(questionId);
      if (!question) {
        return { error: 'Question not found' };
      }
      if (question.difficulty !== 5) {
        return { error: 'Question difficulty must be 5' };
      }
    }


    return this.testService.create(test);
  }

  @Get(':testId')
  @UseGuards(JwtAuthGuard) // Admin only
  async getTestDetails(@Param('testId') testId: string) {
    return this.testService.findById(testId);
  }

  @Get('unique/:uniqueURL')
  async getTestByUniqueURL(@Param('uniqueURL') uniqueURL: string) {
    return this.testService.findByUniqueURL(uniqueURL);
  }

  @Post(':testId/start')
  @UseGuards(JwtAuthGuard)
  async startTest(@Param('testId') testId: string, @Body('userId') userId: string) {
    return this.testService.startTest(testId, userId);
  }

  @Post(':testId/questions/:questionId/answer')
  @UseGuards(JwtAuthGuard)
  async submitAnswer(
    @Param('testId') testId: string,
    @Param('questionId') questionId: string,
    @Body('userId') userId: string,
    @Body('answer') answer: any,
  ) {
    return this.testService.submitAnswer(testId, questionId, userId, answer);
  }
}
