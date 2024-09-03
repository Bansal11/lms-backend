import { Controller, Post, Get, Param, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Import the authentication guard

@Controller('questions')
@UseGuards(JwtAuthGuard) // Apply the JWT authentication guard
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('create')
  async create(
    @Body() createQuestionDto: { 
    text: string; 
    difficulty: number; 
    weight: number;
    correctAnswer: string;
    options: string[];
  }) {

    if (!createQuestionDto.text) {
      return { error: 'Text is required' };
    }

    if (!createQuestionDto.difficulty) {
      return { error: 'Difficulty is required' };
    }

    if (!createQuestionDto.weight) {
      return { error: 'Weight is required' };
    }

    if (!createQuestionDto.correctAnswer) {
      return { error: 'Correct answer is required' };
    }

    if (!createQuestionDto.options || createQuestionDto.options.length < 2) {
      return { error: 'At least two options are required' };
    }

    let createdQuestion = await this.questionService.create(createQuestionDto);

    return {
      status: 'success',
      message: 'Question created successfully',
      data: createdQuestion
    }
  }

  @Get('all')
  async findAll() {
    return this.questionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateQuestionDto: Partial<{ text: string; difficulty: number; weight: number }>) {
    return this.questionService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.questionService.remove(id);
  }
}
