import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  category_name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image_path?: string;

  @IsOptional()
  @IsDateString()
  created_at?: string;
}

export class CategoryDto {
  @IsString()
  @IsNotEmpty()
  category_name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image_path?: string;

  @IsOptional()
  @IsString()
  category_id?: string;

  @IsOptional()
  @IsDateString()
  created_at?: string;
}