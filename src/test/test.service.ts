import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test, TestDocument } from './test.schema';
import { QuestionService } from 'src/question/question.service';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(Test.name) private testModel: Model<TestDocument>,
    private questionService: QuestionService, // Inject the QuestionService
  ) {}

  async create(test: {
    title: string;
    description: string;
    questions: string[];
    uniqueURL: string;
  }): Promise<Test> {

    let createdTest = new this.testModel(test);

    return createdTest.save();

  }

  async findById(testId: string): Promise<Test> {
    const test = await this.testModel.findById(testId).exec();
    if (!test) {
      throw new NotFoundException(`Test with ID ${testId} not found`);
    }
    return test;
  }

  async findByUniqueURL(uniqueURL: string): Promise<Test> {
    const test = await this.testModel.findOne({ uniqueURL }).exec();
    if (!test) {
      throw new NotFoundException(`Test with URL ${uniqueURL} not found`);
    }
    return test;
  }

  async startTest(testId: string, userId: string): Promise<Test> {
    // You might need to implement logic to start the test, e.g., logging when the user starts.
    const test = await this.testModel.findById(testId).exec();
    if (!test) {
      throw new NotFoundException(`Test with ID ${testId} not found`);
    }
    // Additional logic to start the test can go here, like initializing user-specific test sessions
    return test;
  }

  async submitAnswer(
    testId: string,
    questionId: string,
    userId: string,
    answer: any,
  ): Promise<{ nextQuestion?: any; message?: string }> {
    const test = await this.testModel.findById(testId).exec();
    if (!test) {
      throw new NotFoundException(`Test with ID ${testId} not found`);
    }

    const question = await this.questionService.findOne(questionId);
    if (!question) {
      throw new NotFoundException(`Question with ID ${questionId} not found`);
    }

    // Evaluate the answer
    const isCorrect = this.evaluateAnswer(question, answer);

    // Find or initialize user result
    let userResult = test.results.find((result) => result.userId === userId);
    if (!userResult) {
      userResult = { userId, score: 0, currentQuestionIndex: 0 };
      test.results.push(userResult);
    }

    // Update the score and adaptive algorithm
    userResult.score += isCorrect ? question.weight : 0;

    const { nextDifficulty, message } = this.getNextDifficulty(
      question.difficulty,
      isCorrect,
      userResult,
    );

    if (message) {
      await test.save();
      return { message };
    }

    // Find the next question based on the difficulty
    const nextQuestion = await this.questionService.findOneByDifficulty(
      nextDifficulty,
    );

    userResult.currentQuestionIndex++;
    await test.save();

    return { nextQuestion };
  }

  private evaluateAnswer(question: any, answer: any): boolean {
    return question.correctAnswer === answer;
  }

  private getNextDifficulty(
    currentDifficulty: number,
    isCorrect: boolean,
    userResult: any,
  ): { nextDifficulty: number; message?: string } {
    let nextDifficulty = currentDifficulty;

    if (isCorrect) {
      nextDifficulty = Math.min(currentDifficulty + 1, 10);
      if (nextDifficulty === 10 && userResult.consecutiveCorrect >= 2) {
        return { nextDifficulty, message: 'Test complete: You have answered 3 consecutive questions of difficulty 10 correctly.' };
      }
      userResult.consecutiveCorrect = (userResult.consecutiveCorrect || 0) + 1;
    } else {
      nextDifficulty = Math.max(currentDifficulty - 1, 1);
      if (nextDifficulty === 1) {
        return { nextDifficulty, message: 'Test complete: You have incorrectly answered a question of difficulty 1.' };
      }
      userResult.consecutiveCorrect = 0;
    }

    if (userResult.currentQuestionIndex >= 19) {
      return { nextDifficulty, message: 'Test complete: You have attempted 20 questions.' };
    }

    return { nextDifficulty };
  }

}
