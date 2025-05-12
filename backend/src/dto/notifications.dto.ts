import { IsNotEmpty, IsNotEmptyObject, IsString, Length } from 'class-validator';
import { CustomRequest } from 'src/types/request.type';
import { Tables } from 'src/types/supabase';

export class UpdateNotificationDto {
  @IsString()
  @Length(10, 20)
  @IsNotEmpty()
  id: string

  @IsNotEmptyObject()
  req: CustomRequest

  @IsNotEmptyObject()
  body: Partial<Tables<'notifications'>>
}