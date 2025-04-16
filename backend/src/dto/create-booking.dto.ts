import { IsUUID, IsDateString, IsInt, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class CreateReservationDto {
  @IsUUID()
  item_id: string;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsInt()
  quantity: number;
}

export class CreateBookingDto {
  @IsUUID()
  user_id: string;

  @ValidateNested({ each: true })
  @Type(() => CreateReservationDto)
  @ArrayMinSize(1)
  items: CreateReservationDto[];
}