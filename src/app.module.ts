import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { QuestionModule } from './question/question.module';
import { TestModule } from './test/test.module';
import { AuthMiddleware } from './middlewares/auth/auth.middleware';
import { AdminMiddleware } from './middlewares/privileges/admin.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    UserModule,
    QuestionModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
  ],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'questions', method: RequestMethod.ALL },
        { path: 'tests/:testId', method: RequestMethod.ALL },
      );

    consumer
      .apply(AdminMiddleware)
      .forRoutes(
        { path: 'questions', method: RequestMethod.ALL },
        { path: 'tests/:testId', method: RequestMethod.GET },
      );
  }
}
