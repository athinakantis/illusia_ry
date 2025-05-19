"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
let BookingService = class BookingService {
    async getBookings(req) {
        const supabase = req['supabase'];
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return {
            message: 'Bookings retrieved successfully',
            data: data || [],
        };
    }
    async getBookingById(req, id) {
        const supabase = req['supabase'];
        const { data: bookingData, error: bookingError } = await supabase
            .from('bookings')
            .select(`*`)
            .eq('booking_id', id)
            .single();
        if (bookingError)
            throw new common_1.BadRequestException(bookingError.message);
        if (!bookingData)
            throw new common_1.NotFoundException(`Booking ${id} not found`);
        const { data: reservationData, error: reservationError } = await supabase
            .from('item_reservations')
            .select(`quantity, start_date, end_date, item:item_id (*)`)
            .eq('booking_id', id);
        if (reservationError)
            throw new common_1.BadRequestException(reservationError.message);
        if (!reservationData)
            throw new common_1.NotFoundException(`No items found for booking ${id}`);
        const formattedRes = reservationData.map((r) => ({
            ...r.item,
            quantity: r.quantity,
            start_date: r.start_date,
            end_date: r.end_date,
        }));
        const bookingWithItems = {
            booking: bookingData,
            items: formattedRes,
        };
        return {
            message: `Booking ${id} retrieved successfully`,
            data: bookingWithItems,
        };
    }
    async createBooking(req, payload) {
        const supabase = req['supabase'];
        const userId = req['user']?.id;
        const { data: bookingData, error: bookingError } = await supabase
            .from('bookings')
            .insert({ user_id: userId })
            .select()
            .single();
        if (bookingError) {
            throw new common_1.BadRequestException(bookingError.message);
        }
        const booking_id = bookingData.booking_id;
        const reservationRows = payload.items.map((item) => ({
            booking_id,
            item_id: item.item_id,
            start_date: item.start_date,
            end_date: item.end_date,
            quantity: item.quantity,
        }));
        const { error: reservationError } = await supabase
            .from('item_reservations')
            .insert(reservationRows);
        if (reservationError) {
            throw new common_1.BadRequestException(reservationError.message);
        }
        return {
            message: 'Booking created successfully',
            data: {
                booking_id,
                reservations: reservationRows,
            },
        };
    }
    async createBookingWithItemsViaRpc(req, payload) {
        const supabase = req['supabase'];
        const userId = req['user']?.id;
        const { data, error } = await supabase.rpc('create_booking_with_reservations', {
            _user_id: userId,
            _items: payload.items,
        });
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return data;
    }
    async createEmptyBooking(req) {
        const supabase = req['supabase'];
        const userId = req['user']?.id;
        const { data, error } = await supabase
            .from('bookings')
            .insert({ user_id: userId })
            .select()
            .single();
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return {
            message: 'Empty booking created successfully',
            data,
        };
    }
    async reviewBookingAvailability(req, bookingId) {
        const supabase = req['supabase'];
        const { data: reservations, error } = await supabase
            .from('item_reservations')
            .select('id, item_id, start_date, end_date, quantity')
            .eq('booking_id', bookingId);
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        if (!reservations || reservations.length === 0) {
            return {
                message: 'No reservations found for booking',
                data: {
                    booking_id: bookingId,
                    status: 'fail',
                    issues: ['No reservations found.'],
                },
            };
        }
        const issues = [];
        for (const r of reservations) {
            const { id, item_id, start_date, end_date, quantity } = r;
            const { data: totalStockData, error: stockErr } = await supabase
                .from('items')
                .select('quantity')
                .eq('item_id', item_id)
                .single();
            if (stockErr || !totalStockData) {
                issues.push(`Reservation ${id}: Item ${item_id}: could not fetch stock info`);
                continue;
            }
            const totalStock = totalStockData.quantity;
            const { data: overlapping, error: overlapErr } = await supabase
                .from('item_reservations')
                .select('quantity')
                .eq('item_id', item_id)
                .lte('start_date', end_date)
                .gte('end_date', start_date);
            if (overlapErr) {
                issues.push(`Reservation ${id}: Item ${item_id}: error checking overlapping reservations`);
                continue;
            }
            const alreadyReserved = overlapping.reduce((sum, row) => sum + row.quantity, 0);
            const available = totalStock - alreadyReserved;
            if (available < quantity) {
                issues.push(`Reservation ${id}: Item ${item_id} only has ${available} left during ${start_date} - ${end_date}`);
            }
        }
        const uniqueIssues = [...new Set(issues)];
        return {
            message: 'Availability review completed',
            data: {
                booking_id: bookingId,
                status: uniqueIssues.length === 0 ? 'ok' : 'fail',
                issues: uniqueIssues,
            },
        };
    }
    async updateBookingStatus(req, bookingId, status) {
        const supabase = req['supabase'];
        if (!status) {
            throw new common_1.BadRequestException('Status value is required');
        }
        const { data, error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('booking_id', bookingId)
            .select()
            .maybeSingle();
        if (!data) {
            throw new common_1.NotFoundException(`Booking ${bookingId} not found`);
        }
        if (error) {
            throw new common_1.BadRequestException(error);
        }
        return {
            message: `Booking ${bookingId} status updated to "${status}"`,
            data,
        };
    }
    async deleteBooking(req, bookingId) {
        const supabase = req['supabase'];
        const { data, error } = await supabase
            .from('bookings')
            .delete()
            .eq('booking_id', bookingId)
            .select();
        if (!data) {
            throw new common_1.NotFoundException(`Booking ${bookingId} not found`);
        }
        if (!data.length) {
            throw new common_1.NotFoundException(`Booking ${bookingId} not found`);
        }
        if (error) {
            throw new common_1.BadRequestException(error);
        }
        return {
            message: 'Booking deleted successfully',
            data: data ?? [],
        };
    }
    async getUserBookings(req, userId) {
        const supabase = req['supabase'];
        const { data, error } = await supabase.rpc('get_user_bookings', {
            p_user_id: userId,
        });
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return {
            message: `Bookings for user ${userId} retrieved successfully`,
            data: data ?? [],
        };
    }
    async getUpcomingBookings(req, amount) {
        if (typeof +amount !== 'number')
            throw new Error('Amount must be an integer');
        const today = new Date().toISOString().slice(0, 10);
        const supabase = req['supabase'];
        const { data, error } = await supabase
            .from('upcoming_bookings')
            .select(`*, booking:booking_id (status, user_id,
    user:user_id (display_name, email))`)
            .order('start_date')
            .limit(+amount);
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return {
            message: 'Successfully retrieved upcoming bookings!',
            data: data,
        };
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)()
], BookingService);
//# sourceMappingURL=bookings.service.js.map