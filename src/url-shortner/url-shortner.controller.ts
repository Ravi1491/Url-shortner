import { Controller, Get, Post, Body, Res, Query } from '@nestjs/common';
import { UrlShortnerService } from './url-shortner.service';
const shortid = require('shortid');
import { Response } from 'express';
import { getSanitizedUrl } from 'src/utils/helper';

@Controller('url-shortner')
export class UrlShortnerController {
  constructor(private readonly urlShortnerService: UrlShortnerService) {}

  @Post('create')
  async create(@Body() body: { url: string }, @Res() res: Response) {
    if (!body || !body.url) {
      return res.status(400).json({ 'Invalid request': 'Please provide url' });
    }

    const url = body.url;
    const generateSlug = shortid.generate();

    const sanitizedUrl = getSanitizedUrl(url);

    const urlShortener = await this.urlShortnerService.create({
      originalUrl: sanitizedUrl,
      shortCode: generateSlug,
      clickCount: 0,
    });

    return res.json(urlShortener);
  }

  @Post('createCustom')
  async createCustom(
    @Body() body: { url: string; slug: string },
    @Res() res: Response,
  ) {
    if (!body || !body.url || !body.slug) {
      return res
        .status(400)
        .json({ 'Invalid request': 'Please provide url and slug' });
    }

    const url = body.url;
    const slug = body.slug;

    const sanitizedUrl = getSanitizedUrl(url);

    const urlShortener = await this.urlShortnerService.create({
      originalUrl: sanitizedUrl,
      shortCode: slug,
      clickCount: 0,
    });

    return res.json(urlShortener);
  }

  @Get('handleRedirect')
  async findOne(@Query('shortCode') shortCode: string, @Res() res: Response) {
    if (!shortCode) {
      return res
        .status(400)
        .json({ 'Invalid request': 'Please provide shortCode' });
    }

    const urlShortener = await this.urlShortnerService.findOne(shortCode);
    const redirectUri = new URL(urlShortener.originalUrl);

    return res.redirect(redirectUri.toString());
  }
}
