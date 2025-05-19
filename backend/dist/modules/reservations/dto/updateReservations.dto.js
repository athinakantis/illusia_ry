"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReservationDto = void 0;
const class_validator_1 = require("class-validator");
const class_validator_2 = require("class-validator");
let MaxPeriodConstraint = class MaxPeriodConstraint {
    validate(endDate, args) {
        const object = args.object;
        if (!object.start_date || !endDate)
            return true;
        const start = new Date(object.start_date);
        const end = new Date(endDate);
        const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 14;
    }
    defaultMessage() {
        return 'Reservation period cannot exceed 14 days';
    }
};
MaxPeriodConstraint = __decorate([
    (0, class_validator_2.ValidatorConstraint)({ name: 'MaxPeriod', async: false })
], MaxPeriodConstraint);
function MaxPeriod(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_2.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: MaxPeriodConstraint,
        });
    };
}
class UpdateReservationDto {
}
exports.UpdateReservationDto = UpdateReservationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateReservationDto.prototype, "item_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateReservationDto.prototype, "start_date", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.end_date),
    (0, class_validator_1.IsDateString)(),
    MaxPeriod({ message: 'Reservation cannot exceed 14 days' }),
    __metadata("design:type", String)
], UpdateReservationDto.prototype, "end_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateReservationDto.prototype, "quantity", void 0);
//# sourceMappingURL=updateReservations.dto.js.map