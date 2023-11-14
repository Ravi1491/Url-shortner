import { Controller, Get, Post, Body, Res, Query } from '@nestjs/common';
import { UrlShortnerService } from './url-shortner.service';
const shortid = require('shortid');
import { Response } from 'express';

@Controller('url-shortner')
export class UrlShortnerController {
  constructor(private readonly urlShortnerService: UrlShortnerService) {}

  @Post('create')
  create(@Body() body: { url: string }) {
    const url = body.url;
    const generateSlug = shortid.generate();

    const createUrlShortner = {
      originalUrl: url,
      shortCode: generateSlug,
      clickCount: 0,
    };

    return this.urlShortnerService.create(createUrlShortner);
  }

  @Get('handleRedirect')
  async findOne(@Query('id') shortId: string, @Res() res: Response) {
    const url = await this.urlShortnerService.findOne(shortId);
    const redirectUri = new URL(url.originalUrl);
    return res.redirect(redirectUri.toString());
  }
}
