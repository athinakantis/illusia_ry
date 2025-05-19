"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemReservationService = void 0;
const common_1 = require("@nestjs/common");
let ItemReservationService = class ItemReservationService {
    async getAllReservations(req) {
        const supabase = req['supabase'];
        const { data, error } = await supabase
            .from('item_reservations')
            .select('*')
            .order('start_date', { ascending: true });
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return {
            message: 'All reservations retrieved successfully',
            data: data ?? [],
        };
    }
    async getReservationsForItem(req, itemId) {
        const supabase = req['supabase'];
        const { data, error } = await supabase
            .from('item_reservations')
            .select('*')
            .eq('item_id', itemId)
            .order('start_date', { ascending: true });
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return {
            message: `Reservations for item ${itemId} retrieved successfully`,
            data: data ?? [],
        };
    }
    async getReservationsByBooking(req, bookingId) {
        const supabase = req['supabase'];
        const { data, error } = await supabase
            .from('item_reservations')
            .select('*')
            .eq('booking_id', bookingId);
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return {
            message: `Reservations for booking ${bookingId} retrieved successfully`,
            data: data ?? [],
        };
    }
    async getReservationsInDateRange(req, from, to) {
        const supabase = req['supabase'];
        const { data, error } = await supabase
            .from('item_reservations')
            .select('*')
            .lte('start_date', to)
            .gte('end_date', from)
            .order('start_date', { ascending: true });
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return {
            message: `Reservations between ${from} and ${to} retrieved successfully`,
            data: data ?? [],
        };
    }
    async getReservationsForItemInDateRange(req, itemId, from, to) {
        const supabase = req['supabase'];
        const { data, error } = await supabase
            .from('item_reservations')
            .select('*')
            .eq('item_id', itemId)
            .lte('start_date', to)
            .gte('end_date', from)
            .order('start_date', { ascending: true });
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return {
            message: `Reservations for item ${itemId} between ${from} and ${to} retrieved successfully`,
            data: data ?? [],
        };
    }
    async getReservationsByStartDate(req, startDate) {
        const supabase = req['supabase'];
        const { data, error } = await supabase
            .from('item_reservations')
            .select('*')
            .eq('start_date', startDate);
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return {
            message: `Reservations starting on ${startDate} retrieved successfully`,
            data: data ?? [],
        };
    }
    async getReservationsByEndDate(req, endDate) {
        const supabase = req['supabase'];
        const { data, error } = await supabase
            .from('item_reservations')
            .select('*')
            .eq('end_date', endDate);
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return {
            message: `Reservations ending on ${endDate} retrieved successfully`,
            data: data ?? [],
        };
    }
    async createReservation(req, payload) {
        const supabase = req['supabase'];
        const { data, error } = await supabase
            .from('item_reservations')
            .insert(payload)
            .select()
            .single();
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return {
            message: 'Reservation created successfully',
            data,
        };
    }
    async updateReservation(req, bookingId, reservationId, payload) {
        const supabase = req['supabase'];
        if (!payload || Object.keys(payload).length === 0) {
            throw new common_1.BadRequestException('Update payload is empty');
        }
        const { data, error } = await supabase
            .from('item_reservations')
            .update(payload)
            .eq('id', reservationId)
            .eq('booking_id', bookingId)
            .select()
            .maybeSingle();
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        if (!data) {
            throw new common_1.BadRequestException('Reservation not found or not permitted to update(Check Booking/Reservation ID)');
        }
        return {
            message: 'Reservation updated successfully',
            data,
        };
    }
    async deleteReservations(req, bookingId, reservationIds) {
        const supabase = req['supabase'];
        if (!reservationIds.length) {
            return { message: 'Nothing to delete', data: { deleted: 0, deletedItems: [] } };
        }
        const { data, error } = await supabase
            .from('item_reservations')
            .delete()
            .eq('booking_id', bookingId)
            .in('id', reservationIds)
            .select();
        if (!data || data.length === 0) {
            throw new common_1.BadRequestException('Booking not found or no reservations to delete');
        }
        if (data.length !== reservationIds.length) {
            throw new common_1.BadRequestException('Not all reservations were deleted');
        }
        if (error) {
            throw new common_1.BadRequestException(error);
        }
        return {
            message: 'Reservations deleted successfully',
            data: {
                deleted: data ? data.length : 0,
                deletedItems: data
            },
        };
    }
};
exports.ItemReservationService = ItemReservationService;
exports.ItemReservationService = ItemReservationService = __decorate([
    (0, common_1.Injectable)()
], ItemReservationService);
//# sourceMappingURL=reservations.service.js.map