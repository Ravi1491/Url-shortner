import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createUrlShortnerDto: CreateUrlShortnerDto) {
    const existing = await this.urlShortnerModel.findOne({
      shortCode: createUrlShortnerDto.shortCode,
    });
    if (existing) {
      throw new Error('Short code already exists');
    }
    return this.urlShortnerModel.create(createUrlShortnerDto);
  }

  async findOne(shortCode: string) {
    const urlShortener = await this.urlShortnerModel.findOneAndUpdate(
      { shortCode },
      { $inc: { clickCount: 1 } },
    );
    if (!urlShortener) {
      throw new NotFoundException('Short code not found');
    }
    return urlShortener;
  }

  async update(shortCode: string, updateData: Partial<CreateUrlShortnerDto>) {
    const updated = await this.urlShortnerModel.findOneAndUpdate(
      { shortCode },
      updateData,
      { new: true },
    );
    if (!updated) {
      throw new NotFoundException('Short code not found');
    }
    return updated;
  }

  async delete(shortCode: string) {
    const deleted = await this.urlShortnerModel.findOneAndDelete({ shortCode });
    if (!deleted) {
      throw new NotFoundException('Short code not found');
    }
    return deleted;
  }

  async list() {
    return this.urlShortnerModel.find();
  }
}
