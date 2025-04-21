import { getAccessToken } from "../utility/getToken";

function Home() {

  return(
   <div>This is the Home route<button onClick={getAccessToken}>token</button></div>
)}

export default Home;