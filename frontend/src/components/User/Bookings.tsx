
import React, { useEffect } from 'react';
import type { AppDispatch } from '../../store/store';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import {
  fetchUserBookings,
  selectBookings,
  selectBookingsLoading,
  selectBookingsError,
} from '../../slices/bookingsSlice';
import { UserBooking } from '../../api/bookings';

const Bookings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const bookings = useSelector(selectBookings) ?? [];
  const loading = useSelector(selectBookingsLoading);
  const error = useSelector(selectBookingsError);
console.log(bookings)
  useEffect(() => {
    if(!user) return;
    if (user?.id) {
      dispatch(fetchUserBookings(user.id));
    }
  }, [user, dispatch]);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Your Bookings</h1>

      {loading && <p>Loading bookings…</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <p>No bookings found.</p>
      )}

      {!loading && !error && bookings.map((b: UserBooking) => {
        const start = b.reservations?.[0]?.start_date ?? 'N/A';
        const end = b.reservations && b.reservations.length > 0
          ? b.reservations[b.reservations.length - 1].end_date
          : 'N/A';

        return (
          <div
            key={b.booking_id}
            style={{
              border: '1px solid #ccc',
              borderRadius: 4,
              padding: '1rem',
              marginBottom: '1rem',
            }}
          >
            <h2>Booking {b.booking_id}</h2>
            <p><strong>Booking dates:</strong> {start} — {end}</p>

            <h3>Order Summary</h3>
            {b.reservations && b.reservations.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Item ID</th>
                    <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd' }}>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {b.reservations.map((r) => (
                    <tr key={r.id}>
                      <td style={{ padding: '0.5rem 0' }}>{r.item_id}</td>
                      <td style={{ textAlign: 'right', padding: '0.5rem 0' }}>{r.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No reservations</p>
            )}

            {/* Placeholder for future notes/status */}
            <p><strong>Booking status:</strong> {b.status ?? 'N/A'}</p>

            <div style={{ marginTop: '1rem' }}>
              <button style={{ marginRight: '0.5rem' }}>Edit booking</button>
              <button>Cancel booking</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Bookings;