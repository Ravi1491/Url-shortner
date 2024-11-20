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
import { Response, Request } from 'express';
import { getSanitizedUrl } from 'src/utils/helper';
import { ApiTags } from '@nestjs/swagger';
import { CreateUrlShortnerDto } from './dto/create-url-shortner.dto';
import { CurrentUser } from 'src/auth/decorators/current-user';
import { User } from 'src/user/entities/user.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nanoid = require('nanoid');

@ApiTags('url-shortner')
@Controller('url-shortner')
export class UrlShortnerController {
  constructor(private readonly urlShortnerService: UrlShortnerService) {}

  @Post('create')
  async create(
    @Body() body: { url: string; userId: string },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    if (!body || !body.url || !body.userId) {
      return res
        .status(400)
        .json({ 'Invalid request': 'Please provide url and userId' });
    }

    const url = body.url;
    const userId = body.userId;
    const generateSlug = nanoid.nanoid();

    const sanitizedUrl = getSanitizedUrl(url);

    const urlShortener = await this.urlShortnerService.create({
      originalUrl: sanitizedUrl,
      shortCode: generateSlug,
      clickCount: 0,
      userId: userId,
    });

    const shortenedUrl = `${req.get('host')}/${generateSlug}`;

    return res.json({ ...urlShortener, shortenedUrl });
  }

  @Post('createCustom')
  async createCustom(
    @Body() body: { url: string; slug: string; userId: string },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    if (!body || !body.url || !body.slug || !body.userId) {
      return res
        .status(400)
        .json({ 'Invalid request': 'Please provide url, slug, and userId' });
    }

    const url = body.url;
    const slug = body.slug;
    const userId = body.userId;

    // Check if the slug is already taken
    const existingSlug = await this.urlShortnerService.findOne(slug);
    if (existingSlug) {
      return res.status(400).json({ 'Invalid request': 'Slug already taken' });
    }

    const sanitizedUrl = getSanitizedUrl(url);

    const urlShortener = await this.urlShortnerService.create({
      originalUrl: sanitizedUrl,
      shortCode: slug,
      clickCount: 0,
      userId: userId,
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
  async list(@Res() res: Response, @CurrentUser() currentUser: User) {
    const list = await this.urlShortnerService.list(currentUser.id);
    return res.json(list);
  }
}
