import { Injectable } from '@nestjs/common';
import { CreateUrlShortnerDto } from './dto/create-url-shortner.dto';
import { UpdateUrlShortnerDto } from './dto/update-url-shortner.dto';
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

  findAll() {
    return `This action returns all urlShortner`;
  }

  findOne(id: number) {
    return `This action returns a #${id} urlShortner`;
  }

  update(id: number, updateUrlShortnerDto: UpdateUrlShortnerDto) {
    return `This action updates a #${id} urlShortner`;
  }

  remove(id: number) {
    return `This action removes a #${id} urlShortner`;
  }
}
