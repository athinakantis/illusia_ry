import { Controller, Get, Req } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { CustomRequest } from '../types/request.type';

@Controller('views')
export class ViewController {
  constructor(private readonly viewsService: AdminService) {}

  @Get('frontend-items')
  async getFrontendItems(@Req() req: CustomRequest) {
    return this.viewsService.getFrontendItemView(req);
  }
}