import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomRequest } from 'src/types/request.type';
import { ApiResponse } from 'src/types/response';


@Injectable()
export class AccountService {
  constructor() {}

  async updateDisplayName(req: CustomRequest, newName: string): Promise<ApiResponse<{ display_name: string }>> {
    const supabase = req["supabase"]
    const { data, error } = await supabase
      .from('users')
      .update({ display_name: newName })
      .eq('user_id', req.user.id)
      .select('*')
      .maybeSingle();

    if (error) {
        console.error('Error updating display name:', error);
        throw new BadRequestException(error.message);
    }
    if(!data) {
        console.error('No data returned from Supabase');
        throw new BadRequestException('No data returned from Supabase');
    }

    return {
      message: 'Display name updated successfully',
      data: {
        display_name: data.display_name,
      } // starting to only send [] when possible
    };
  }
  
}
