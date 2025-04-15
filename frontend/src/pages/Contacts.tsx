import { useEffect } from "react";
import { fetchAllBookings, selectAllBookings } from "../slices/bookingsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchAllReservations, selectAllReservations } from "../slices/reservationsSlice";


function Contacts() {

    const bookings = useAppSelector(selectAllBookings);
    const reservations = useAppSelector(selectAllReservations);
    const dispatch = useAppDispatch();


    useEffect(() => {
        if (bookings.length < 1) {
            dispatch(fetchAllBookings())
        } else {
            console.log(bookings);

        }
    }, [dispatch, bookings]);

    useEffect(() => {
        if (bookings.length < 1) {
            dispatch(fetchAllReservations())
        } else {
            console.log(reservations);

        }
    }, [dispatch, reservations]);


    return (
        <>
            <div>This is the Contact route</div>
        </>
    )
}

export default Contacts;