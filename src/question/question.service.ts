import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './question.schema';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async create(createQuestionDto: { text: string; difficulty: number; weight: number }): Promise<Question> {
    const createdQuestion = new this.questionModel(createQuestionDto);
    return createdQuestion.save();
  }

  async findAll(): Promise<Question[]> {
    return this.questionModel.find().exec();
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.questionModel.findById(id).exec();
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async update(id: string, updateQuestionDto: Partial<{ text: string; difficulty: number; weight: number }>): Promise<Question> {
    const question = await this.questionModel.findByIdAndUpdate(id, updateQuestionDto, { new: true }).exec();
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async remove(_id: string): Promise<Question> {
    const question = await this.questionModel.findOneAndDelete({_id}).exec();
    if (!question) {
      throw new NotFoundException(`Question with ID ${_id} not found`);
    }
    return question;
  }

  async findOneByDifficulty(difficulty: number): Promise<Question> {
    const question = await this.questionModel
      .findOne({ difficulty })
      .exec();
    if (!question) {
      throw new NotFoundException(`Question with difficulty ${difficulty} not found`);
    }
    return question;
  }

  async createMany(questions: Partial<Question>[]) {
    this.questionModel.insertMany(questions);
  }

}
