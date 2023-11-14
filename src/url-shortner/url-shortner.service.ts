import { Injectable } from '@nestjs/common';
import { CreateUrlShortnerDto } from './dto/create-url-shortner.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UrlShortener } from './entities/url-shortner.entity';

@Injectable()
export class UrlShortnerService {
  constructor(
    @InjectModel(UrlShortener.name)
    private readonly urlShortnerModel: Model<UrlShortener>,
  ) {}

  create(createUrlShortnerDto: CreateUrlShortnerDto) {
    return this.urlShortnerModel.create(createUrlShortnerDto);
  }

  findOne(shortCode: string) {
    return this.urlShortnerModel.findOneAndUpdate(
      { shortCode },
      { $inc: { clickCount: 1 } },
    );
  }
}
