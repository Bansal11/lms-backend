import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TestDocument = Test & Document;

@Schema()
export class Test {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  questions: string[]; // Array of question IDs

  @Prop({ required: true })
  uniqueURL: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: [{ userId: String, score: Number, currentQuestionIndex: Number }] })
  results: { userId: string; score: number; currentQuestionIndex: number }[];
}

export const TestSchema = SchemaFactory.createForClass(Test);
