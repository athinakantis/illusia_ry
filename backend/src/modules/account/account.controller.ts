
import { Body, Controller, Delete, Get, Patch, Put, Req } from '@nestjs/common';
import { CustomRequest } from 'src/types/request.type';
import { AccountService } from './account.service';
import { SupabaseService } from '../supabase/supabase.service';
import { Tables } from 'src/types/supabase';


@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly supabaseService: SupabaseService
  ) {}
  /**
   * Change the current users display_name
   * @param req Custom Reqest with Supabase Client
   * @param newName New display name
   * @returns { message:string, data: User }
   */
  @Put('display-name')
  async updateDisplayName(
    @Req() req: CustomRequest,
    @Body("newName") newName: string,
  ): Promise<{ message: string; data: { display_name: string } }> {
    if (!req.user || !req.user.id) {
      throw new Error('User not found in request');
    }
    if(!newName) {
      throw new Error('New display name is required');
    }
    return this.accountService.updateDisplayName(req, newName);
  }
    // Get the user from the request
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