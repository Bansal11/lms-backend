import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema()
export class Question {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true, min: 1, max: 10 })
  difficulty: number;

  @Prop({ required: true })
  weight: number;

  @Prop({ required: true })
  correctAnswer: string;

  @Prop({ required: true })
  options: string[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
