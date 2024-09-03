import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { QuestionService } from '../src/question/question.service';
import { Question } from '../src/question/question.schema';

async function bootstrap() {
  // Initialize the NestJS application context
  const app = await NestFactory.createApplicationContext(AppModule);

  // Get the QuestionService from the app context
  const questionService = app.get(QuestionService);

  // Generate 500 random questions
  const questions: Partial<Question>[] = [];

  for (let i = 0; i < 500; i++) {
    questions.push({
      text: `Question ${i + 1}`,
      difficulty: Math.floor(Math.random() * 10) + 1, // Difficulty between 1 and 10
      correctAnswer: //set random correct answer from options
        ['Option 1', 'Option 2', 'Option 3', 'Option 4'][Math.floor(Math.random() * 4)],
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'], // Add relevant options
    });
  }

  // Insert questions into the database
  try {
    await questionService.createMany(questions);
    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error inserting seed data:', error);
  }

  // Close the NestJS application context
  await app.close();
}

bootstrap();
