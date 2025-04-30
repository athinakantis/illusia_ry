import {
    Body,
    Controller,
    Delete,
    Param,
    Post,
    Put,
    Req,
  } from '@nestjs/common';
import { TagService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { CustomRequest } from 'src/types/request.type';
import { UpdateTagDto } from './dto/update-tag.dto';

  
  @Controller('tags')
  export class TagController {
    constructor(private readonly tagService: TagService) {}
  
    @Post()
    create(@Req() req: CustomRequest, @Body() dto: CreateTagDto) {
      return this.tagService.create(req, dto);
    }
  
    @Put(':id')
    update(
      @Req() req: CustomRequest,
      @Param('id') id: string,
      @Body() dto: UpdateTagDto,
    ) {
      return this.tagService.update(req, id, dto);
    }
  
    @Delete(':id')
    remove(@Req() req: CustomRequest, @Param('id') id: string) {
      return this.tagService.remove(req, id);
    }
  
    /* -------- OPTIONAL item <-> tag junction routes -------- */
  
    @Post('/items/:itemId/:tagId')
    addTagToItem(
      @Req() req: CustomRequest,
      @Param('itemId') itemId: string,
      @Param('tagId') tagId: string,
    ) {
      return this.tagService.addTagToItem(req, itemId, tagId);
    }
  
    @Delete('/items/:itemId/:tagId')
    removeTagFromItem(
      @Req() req: CustomRequest,
      @Param('itemId') itemId: string,
      @Param('tagId') tagId: string,
    ) {
      return this.tagService.removeTagFromItem(req, itemId, tagId);
    }
  }