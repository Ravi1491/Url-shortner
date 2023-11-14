import { PartialType } from '@nestjs/mapped-types';
import { CreateUrlShortnerDto } from './create-url-shortner.dto';

export class UpdateUrlShortnerDto extends PartialType(CreateUrlShortnerDto) {}
