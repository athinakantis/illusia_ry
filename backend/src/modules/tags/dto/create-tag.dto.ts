import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  tag_name!: string;

  @IsOptional()
  @IsString()
  description?: string;

}

export class TagDto {
  @IsString()
  @IsNotEmpty()
  tag_name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  tag_id?: string;
  
  @IsOptional()
  @IsDateString()
  created_at?: string;
}