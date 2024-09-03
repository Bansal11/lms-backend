import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { TestService } from './test.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService) {}

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
