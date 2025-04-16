import getSession from "../utility/getSession";

function Home() {
    
  return(
    <div>
      <h1>Home Page</h1>
      <button onClick={getSession}>Get Session</button>
    </div>
  );
}

export default Home;