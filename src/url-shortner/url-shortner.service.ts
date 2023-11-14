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

  findOne(id: string) {
    return this.urlShortnerModel.findOneAndUpdate(
      { shortUrl: id },
      { $inc: { clicks: 1 } },
    );
  }
}
