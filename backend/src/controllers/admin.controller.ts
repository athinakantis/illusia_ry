import { Controller, Get, Param, Req } from '@nestjs/common';
import { AdminService } from 'src/services/admin.service';
import { CustomRequest } from 'src/types/request.type';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminsService: AdminService) {}

  @Get('users')
  async getAllUsers(@Req() req: CustomRequest) {
    return this.adminsService.getAllUsers(req);
  }

  @Get('users/:id')
  async getUserById(@Req() req: CustomRequest, @Param('id') userId: string) {
    return this.adminsService.getUserById(req, userId);
  }
}
