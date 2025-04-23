import { bookingsApi } from "../api/bookings";
import { useAuth } from "../hooks/useAuth";

const Test = () => {
    const {user} = useAuth();
    const currentUser = user;
    console.log(user)
    const getBookings = async () => {
        try {
            const { data, error, message } = await bookingsApi.getUserBookings(currentUser.id);
            console.log("data", data);
            console.log("error", error);
            console.log("message", message);
        }
        catch (error) {
            console.error("Error fetching bookings:", error);
        }
    }

  return (
    <div>
        <button onClick={getBookings}>Get Bookings</button>
      <h1>Test</h1>
      <p>This is a test page.</p>
    </div>
  );
}

export default Test;