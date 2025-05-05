
import { Controller, Delete, Req } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

import { Request } from 'express';
import { CustomRequest } from 'src/types/request.type';


@Controller('account')
export class AccountController {
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * DELETE /account/me
   * Deletes the currently authenticated user and all associated data.
   */
  @Delete('me')
  async deleteOwnAccount(@Req() req: CustomRequest) {
    // Assumes your auth middleware attaches the user to req.user
    console.log(req)
    const user = req["user"]
    if (!user || !user.id) {
      throw new Error('User not found in request');
    }

    // Delete the Auth user (service role key required)
    await this.supabaseService.deleteUserById(user.id);

    // Optionally, log out the user or return a message
    return { message: 'Account deleted successfully.' };
  }
}