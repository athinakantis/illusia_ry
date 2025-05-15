import { Controller, Get, Req } from '@nestjs/common';
import { CustomRequest } from '../../types/request.type';
import { ViewsService } from './view.service';

@Controller('views')
export class ViewsController  {
  constructor(private readonly viewsService: ViewsService) {}

  @Get('frontend-items')
  async getFrontendItems(@Req() req: CustomRequest) {
    return this.viewsService.getFrontendItemView(req);
  }
}