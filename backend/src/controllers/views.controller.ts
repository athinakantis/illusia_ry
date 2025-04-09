import { Controller, Get, Req } from '@nestjs/common';
import { ViewsService } from '../services/view.service';
import { CustomRequest } from '../types/request.type';

@Controller('views')
export class ViewController {
  constructor(private readonly viewsService: ViewsService) {}

  @Get('frontend-items')
  async getFrontendItems(@Req() req: CustomRequest) {
    return this.viewsService.getFrontendItemView(req);
  }
}