import "./App.css";
import { useState, useEffect } from "react";

//hit the home route to check connectivity
async function getHome() {
  const response = await fetch("http://localhost:8000", {
    mode: "cors",
  });
  const data = await response.json();
  return data;
}

//hit the get repo route
async function getRepos() {
  const response = await fetch("http://localhost:8000/github/repos", {
    mode: "cors",
  });
  const data = await response.json();
  //console.log(data);
  return data;
}

//hit the clone repo route
async function cloneRepo(name, url) {
  const response = await fetch("http://localhost:8000/github/clone-repo", {
    mode: "cors",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repo_name: name, clone_url: url }),
  });

  const data = await response.json();
  //console.log(data);
  return data;
}

function App() {
  const [response, setResponse] = useState([]);
  const [welcomemsg, setWelcomemsg] = useState(null);
  const [clonemsg, setClonemsg] = useState("No clone yet!");
  const [cloneURL, setCloneURL] = useState("");
  const [repoName, setrepoName] = useState("");

  const onChangeRepoName = (evt) => {
    const value = evt.target.value;
    setrepoName(value);
  };

  const onChangeCloneURL = (evt) => {
    const value = evt.target.value;
    setCloneURL(value);
  };

  useEffect(() => {
    getHome()
      .then((res) => {
        setWelcomemsg(res.data[0].message);
      })
      .catch((error) => console.log(error));

    getRepos()
      .then((res) => {
        setResponse(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="App">
      {/* Welcome Header Message */}
      <header className="App-header">
        <h1>{welcomemsg}</h1>
      </header>

      {/* Clone Repos Section */}
      <h2>Clone Repo</h2>
      <input
        type="text"
        onChange={onChangeRepoName}
        placeholder="Put Your Repo Name Here"
        style={{
          width: "30vw",
        }}
      />
      <br></br>
      <input
        type="text"
        onChange={onChangeCloneURL}
        placeholder="Put Your Clone URL Here"
        style={{
          width: "30vw", 
        }}
      />
      <br></br>
      <button
        onClick={() => {
          console.log(repoName + cloneURL);
          cloneRepo(repoName, cloneURL)
            .then((res) => {
              setClonemsg(res.message);
            })
            .catch((error) => console.log(error));
        }}
      >
        Clone Repo
      </button>
      <p>Cloning Status: {clonemsg}</p>

      {/* Get Repo Section */}
      <h2>Your List Of Available Repositories</h2>
      {response.map((item) => (
        <p>
          Name: {item.name}
          <br></br>
          Clone URL: {item.cloneUrl}
          <br></br>
          Description: {item.description}
        </p>
      ))}
    </div>
  );
}

export default App;
