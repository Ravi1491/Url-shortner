import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Res,
  Param,
  Req,
} from '@nestjs/common';
import { UrlShortnerService } from './url-shortner.service';
import shortid from 'shortid';
import { Response, Request } from 'express';
import { getSanitizedUrl } from 'src/utils/helper';
import { ApiTags } from '@nestjs/swagger';
import { CreateUrlShortnerDto } from './dto/create-url-shortner.dto';

@ApiTags('url-shortner')
@Controller('url-shortner')
export class UrlShortnerController {
  constructor(private readonly urlShortnerService: UrlShortnerService) {}

  @Post('create')
  async create(
    @Body() body: { url: string },
    @Res() res: Response,
    @Req() req: Request,
  ) {
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

    const shortenedUrl = `${req.get('host')}/${generateSlug}`;

    return res.json({ ...urlShortener, shortenedUrl });
  }

  @Post('createCustom')
  async createCustom(
    @Body() body: { url: string; slug: string },
    @Res() res: Response,
    @Req() req: Request,
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

    const shortenedUrl = `${req.get('host')}/${slug}`;

    return res.json({ ...urlShortener, shortenedUrl });
  }

  @Put('update/:shortCode')
  async update(
    @Param('shortCode') shortCode: string,
    @Body() updateData: Partial<CreateUrlShortnerDto>,
    @Res() res: Response,
  ) {
    const updated = await this.urlShortnerService.update(shortCode, updateData);
    return res.json(updated);
  }

  @Delete('delete/:shortCode')
  async delete(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const deleted = await this.urlShortnerService.delete(shortCode);
    return res.json(deleted);
  }

  @Get('list')
  async list(@Res() res: Response) {
    const list = await this.urlShortnerService.list();
    return res.json(list);
  }
}
