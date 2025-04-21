import { useEffect, useState } from 'react';
import {
  getUserBookings,
  updateBookingStatus,
  updateReservation,
  deleteReservations,
} from '../api/bookings';
import { useAuth } from '../hooks/useAuth';

/**
 * A throw‑away playground page that lets you manually test the backend
 * endpoints from the browser.  Nothing here is meant for production –
 * it merely wires buttons and text‑areas to the API helpers so you can
 * tweak IDs / payloads and see the live JSON responses.
 */
const Test = () => {
    const { user} = useAuth();
  /* ---- basic input fields ------------------------------------------------ */
  const [bookingId, setBookingId] = useState('');
  const [reservationId, setReservationId] = useState('');
  const [status, setStatus] = useState<'pending' | 'approved' | 'cancelled'>(
    'approved',
  );
  const [payload, setPayload] = useState(
    JSON.stringify(
      {
        start_date: '2025-09-01',
        end_date: '2025-09-05',
        quantity: 2,
      },
      null,
      2,
    ),
  );

  const [userId, setUserId] = useState('');

/* 🔑 whenever user.id changes, push it into local state */
useEffect(() => {
  if (user?.id) {
    setUserId(user.id);
  }
}, [user?.id]);   // <- dependency array

  /* ---- output ------------------------------------------------------------ */
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  /* ---- helper to wrap each call ----------------------------------------- */
  const call = async (fn: () => Promise<unknown>) => {
    try {
      setError(null);
      const res = await fn();
      console.log(res);
      setResult({
        message: (res as any).message,
        reservation: (res as any).data
      });
    } catch (e) {
      setResult(null);
      setError(
        e instanceof Error ? e.message : 'Unknown error – see console log',
      );
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  /* ---- handlers ---------------------------------------------------------- */
  const handleGetBookings = () =>
    call(() => getUserBookings(userId.trim()));

  const handleUpdateStatus = () =>
    call(() => updateBookingStatus(bookingId.trim(), status));

  const handleUpdateReservation = () =>
    call(() =>
      updateReservation(
        bookingId.trim(),
        reservationId.trim(),
        JSON.parse(payload),
      ),
    );

  const handleDeleteReservations = () =>
    call(() =>
      deleteReservations(bookingId.trim(), [reservationId.trim()]),
    );

  /* ---- render ------------------------------------------------------------ */
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Backend Playground</h1>

      <section>
        <h2>User ID</h2>
        <input
          style={{ width: '100%' }}
          placeholder="user uuid…"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={handleGetBookings}>GET /bookings/user/:userId</button>
      </section>

      <hr />

      <section style={{ marginTop: '2rem' }}>
  <h2>Booking ID (for status / reservation calls)</h2>

  {/* Booking ID text box */}
  <input
    style={{ width: '100%', marginBottom: '0.5rem' }}
    placeholder="booking uuid…"
    value={bookingId}
    onChange={(e) => setBookingId(e.target.value)}
  />

  {/* status selector + button */}
  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value as any)}
    >
      <option value="pending">pending</option>
      <option value="approved">approved</option>
      <option value="cancelled">cancelled</option>
    </select>

    <button onClick={handleUpdateStatus}>
      PATCH /bookings/:bookingId
    </button>
  </div>
</section>

      <hr />

      <section>
        <h2>Reservation ID</h2>
        <input
          style={{ width: '100%' }}
          placeholder="reservation uuid…"
          value={reservationId}
          onChange={(e) => setReservationId(e.target.value)}
        />

        <h3>Reservation payload (JSON)</h3>
        <textarea
          style={{ width: '100%', height: '8rem' }}
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
        />

        <div style={{ marginTop: '0.5rem' }}>
          <button onClick={handleUpdateReservation}>
            PATCH /reservations/booking/:bookingId/:reservationId
          </button>
          <button onClick={handleDeleteReservations} style={{ marginLeft: 8 }}>
            DELETE /reservations/booking/:bookingId
          </button>
        </div>
      </section>

      <hr />

      <section>
        <h2>Result</h2>
        {error && (
          <pre style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{error}</pre>
        )}
        {result && (
          <pre style={{ background: '#f5f5f5', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </section>
    </div>
  );
};

export default Test;