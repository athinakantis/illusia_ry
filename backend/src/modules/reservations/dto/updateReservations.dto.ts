import {
  IsOptional,
  IsUUID,
  IsDateString,
  IsInt,
  Min,
  ValidateIf,
} from 'class-validator';

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'MaxPeriod', async: false })
class MaxPeriodConstraint implements ValidatorConstraintInterface {
  validate(endDate: string, args: ValidationArguments): boolean {
    const object = args.object as UpdateReservationDto;
    if (!object.start_date || !endDate) return true; // Skip validation if start_date or end_date is not provided
    const start = new Date(object.start_date);
    const end = new Date(endDate);
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 14;
  }
  defaultMessage(): string {
    return 'Reservation period cannot exceed 14 days';
  }
}

function MaxPeriod(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: MaxPeriodConstraint,
    });
  };
}

export class UpdateReservationDto {
  @IsOptional()
  @IsUUID()
  item_id?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ValidateIf((o) => o.end_date) // only run if end_date is supplied
  @IsDateString()
  @MaxPeriod({ message: 'Reservation cannot exceed 14 days' })
  end_date?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}