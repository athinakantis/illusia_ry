// src/tags/tags.service.ts
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CustomRequest } from 'src/types/request.type';
import { Tables } from 'src/types/supabase';
import { ApiResponse } from 'src/types/response';
import { CreateTagDto } from 'src/dto/tags/create-tag.dto';
import { UpdateTagDto } from 'src/dto/tags/update-tag.dto';
import { SupabaseService } from './supabase.service';

@Injectable()
export class TagService {
  constructor(
    @Inject(SupabaseService) private readonly supabaseService: SupabaseService,
  ) {}
  /*  If you’d rather inject Supabase directly via a provider,
      remove the methods’ `req: CustomRequest` parameter and add
      `constructor(@Inject(SUPABASE) private readonly supabase: SupabaseClient) {}` */
  /* --------------------------------------------------------- */

  async create(
    req: CustomRequest,
    dto: CreateTagDto,
  ): Promise<ApiResponse<Tables<'tags'>>> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('tags')
      .insert({ tag_name: dto.tag_name, description: dto.description })
      .select('*')      // returning row
      .maybeSingle();   // ← typed helper from Supabase JS v2
      
    if (error?.code === '23505') {
      // unique-violation (if you add a UNIQUE constraint on tag_name)
      throw new BadRequestException(
        `Tag with the name "${dto.tag_name}" already exists`,
      );
    }
    if (!data) {
      throw new BadRequestException('Failed to create tag');
    }
    if (error) throw new BadRequestException(error.message);
    this.supabaseService.logAction({
      user_id: req['user'].id,
      action_type: 'CREATE_TAG',
      target_id: data?.tag_id,
      metadata: {
        tag_name: dto.tag_name,
        description: dto.description,
      },
    })
    return {
      message: 'Tag created',
      data: data as Tables<'tags'>
    };
  }

  async update(
    req: CustomRequest,
    tag_id: string,
    dto: UpdateTagDto,
  ): Promise<ApiResponse<Tables<'tags'>>> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('tags')
      .update({
        tag_name: dto.tag_name,
        description: dto.description,
      })
      .eq('tag_id', tag_id)
      .select('*')
      .maybeSingle();

    if (error) throw new BadRequestException(error.message);
    if (!data) throw new NotFoundException('Tag not found');

    return { message: 'Tag updated', data: data as Tables<'tags'> };
  }

  async remove(req: CustomRequest, tag_id: string): Promise<ApiResponse<[]>> {
    const supabase = this.supabaseService.getClient();

    const { error, count } = await supabase
      .from('tags')
      .delete({ count: 'exact' })
      .eq('tag_id', tag_id);


    if (error) throw new BadRequestException(error.message);
    if (!count) throw new NotFoundException('Tag not found');

    return { message: `Tag ${tag_id} removed`, data: [] };
  }

  /* ---------- OPTIONAL: attach/detach tags to items ---------- */

  async addTagToItem(
    req: CustomRequest,
    item_id: string,
    tag_id: string,
  ): Promise<ApiResponse<Tables<'item_tags'>>> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('item_tags')
      .insert({ item_id, tag_id })
      .select('*')
      .maybeSingle();

    if (error?.code === '23505') {
      throw new BadRequestException('Item already has this tag');
    }
    if (error) throw new BadRequestException(error.message);

    return { message: 'Tag linked to item', data: data as Tables<'item_tags'> };
  }

  async removeTagFromItem(
    req: CustomRequest,
    item_id: string,
    tag_id: string,
  ): Promise<ApiResponse<[]>> {
    const supabase = this.supabaseService.getClient();

    const { error, count } = await supabase
      .from('item_tags')
      .delete({ count: 'exact' })
      .eq('item_id', item_id)
      .eq('tag_id', tag_id);

    if (error) throw new BadRequestException(error.message);
    if (!count)
      throw new NotFoundException('Item is not tagged with the given tag');

    return { message: `Tag ${tag_id} removed from item ${item_id}`, data: [] };
  }
}