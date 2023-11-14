import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
export type UrlShortenerSchemaDocument = HydratedDocument<UrlShortener>;

@Schema()
export class UrlShortener extends Document {
  @Prop()
  originalUrl: string;

  @Prop({ unique: true, required: true })
  shortCode: string;

  @Prop({ default: 0 })
  clickCount: number;
}

export const UrlShortenerSchema = SchemaFactory.createForClass(UrlShortener);
