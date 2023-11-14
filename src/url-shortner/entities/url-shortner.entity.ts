import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
export type UrlShortenerSchemaDocument = HydratedDocument<UrlShortener>;

@Schema()
export class UrlShortener extends Document {
  @Prop()
  url: string;

  @Prop({ unique: true, required: true })
  shortUrl: string;

  @Prop({ default: 0 })
  clicks: number;
}

export const UrlShortenerSchema = SchemaFactory.createForClass(UrlShortener);
