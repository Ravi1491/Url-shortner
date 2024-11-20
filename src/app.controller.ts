import { Controller, Get, Res, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { UrlShortnerService } from './url-shortner/url-shortner.service';
import { Public } from './auth/decorators/public';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly urlShortnerService: UrlShortnerService,
  ) {}

  @Public()
  @Get('health')
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get(':shortCode')
  async handleRedirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ) {
    if (!shortCode) {
      return res
        .status(400)
        .json({ 'Invalid request': 'Please provide shortCode' });
    }

    const urlShortener = await this.urlShortnerService.findOne(shortCode);
    if (!urlShortener) {
      return res.status(404).json({ Error: 'Short code not found' });
    }

    const redirectUri = new URL(urlShortener.originalUrl);
    return res.redirect(redirectUri.toString());
  }
}
