import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UrlShortnerService } from './url-shortner.service';
import { UpdateUrlShortnerDto } from './dto/update-url-shortner.dto';
const shortid = require('shortid');

@Controller('url-shortner')
export class UrlShortnerController {
  constructor(private readonly urlShortnerService: UrlShortnerService) {}

  @Post('create')
  create(@Body() body: { url: string }) {
    const url = body.url;
    const generateSlug = shortid.generate();

    const createUrlShortner = {
      url,
      shortUrl: generateSlug,
      clicks: 0,
    };

    return this.urlShortnerService.create(createUrlShortner);
  }

  @Get()
  findAll() {
    return this.urlShortnerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.urlShortnerService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUrlShortnerDto: UpdateUrlShortnerDto,
  ) {
    return this.urlShortnerService.update(+id, updateUrlShortnerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.urlShortnerService.remove(+id);
  }
}
