import { useEffect } from "react";
import { bookingsApi } from "../api/bookings";
import { useAuth } from "../hooks/useAuth";
import { fetchUserBookings } from "../slices/bookingsSlice";
import { deleteBooking as deleteBookingThunk } from "../slices/bookingsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getAccessToken } from "../utility/getToken";
const Test = () => {
   
    const bookings = useAppSelector((state) => state.bookings.bookings);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if(!bookings.length) {
            dispatch(fetchUserBookings("6d6b537c-e38e-4109-ae8c-2b22a56e836b"))
        }

    }, [bookings, dispatch]);
    console.log("bookings", bookings);
    function handleDelete() {
      const bookingId = "40fbed66-02ea-4208-8443-94ed320fc769"; // real id
      dispatch(deleteBookingThunk(bookingId));
    }
  return (
    <div>
        <button onClick={handleDelete}>Test</button>
      <h1>Test</h1>
      <p>This is a test page.</p>
    </div>
  );
}
export default Test;