import { Module } from '@nestjs/common';
import { UrlShortnerService } from './url-shortner.service';
import { UrlShortnerController } from './url-shortner.controller';
import {
  UrlShortener,
  UrlShortenerSchema,
} from './entities/url-shortner.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UrlShortener.name, schema: UrlShortenerSchema },
    ]),
  ],
  controllers: [UrlShortnerController],
  providers: [UrlShortnerService],
  exports: [UrlShortnerService],
})
export class UrlShortnerModule {}
