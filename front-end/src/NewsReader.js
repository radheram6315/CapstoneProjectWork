
import { QueryForm } from './QueryForm';
import { Articles } from './Articles';
import { useState, useEffect } from 'react';
import { exampleQuery ,exampleData } from './data';
import { SavedQueries } from './SavedQueries';
import { LoginForm } from './LoginForm';

const urlQueries = "/queries"
const urlUsersAuth = "/users/authenticate";
const urlNews="/news"

export function NewsReader() {
  const [query, setQuery] = useState(exampleQuery); // latest query send to newsapi
  const [data, setData] = useState(exampleData);   // current data returned from newsapi
  const [queryFormObject, setQueryFormObject] = useState({ ...exampleQuery });
  const [savedQueries, setSavedQueries] = useState([{ ...exampleQuery }]);
  const [currentUser, setCurrentUser] = useState(null);
  const [credentials, setCredentials] = useState({ user: "", password: "" });

  useEffect(() => {
    getNews(query);
  }, [query])

  async function getQueryList() {
    try {
      const response = await fetch(urlQueries);
        if (response.ok) {
        const data = await response.json();
        console.log("savedQueries has been retrieved: ");
        setSavedQueries(data);
      }
      } catch (error) {
      console.error('Error fetching news:', error);
    }
  } 
  
  async function saveQueryList(savedQueries) {
    try {
      const response = await fetch(urlQueries, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedQueries),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("savedQueries array has been persisted:");
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }

function onSavedQuerySelect(selectedQuery) {
 setQueryFormObject(selectedQuery);
 setQuery(selectedQuery);
}

function currentUserMatches(user) {
  if (currentUser) {
    if (currentUser.user) {
      if (currentUser.user === user) {
        return true;
      }
    }
  }
  return false;
}
  function onFormSubmit(queryObject) {
    //if user is not logged in don't let them save queries
    if (currentUser === null){
      alert("Log in if you want to create new queries!")
      return;
    }
    //if it is guest user you can only save 3 queries
    if (savedQueries.length >= 3 && currentUserMatches("guest")) {
      alert("guest users cannot submit new queries once saved query count is 3 or greater!")
      return;
      }
    let newSavedQueries = [];
    newSavedQueries.push(queryObject);
    for (let query of savedQueries) {
      if (query.queryName !== queryObject.queryName) {
        newSavedQueries.push(query);
      }
    }
    console.log(JSON.stringify(newSavedQueries));
    saveQueryList(newSavedQueries);
    setSavedQueries(newSavedQueries);    //save queries
    setQuery(queryObject);
  }

  async function getNews(queryObject) {
    if (queryObject.q) {
      try {
        const response = await fetch(urlNews, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(queryObject),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    } else {
      setData({});
    }
  }

  useEffect(() => {getQueryList();}, [])

  async function login() {
    if (currentUser !== null) {
      // logout
      setCurrentUser(null);
    } else {
      // login
      try {
        const response = await fetch(urlUsersAuth, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
        if (response.status === 200) {
          setCurrentUser({ ...credentials });
          setCredentials({ user: "", password: "" });
        } else {
          alert("Error during authentication! " + credentials.user + "/" + credentials.password);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error authenticating user:', error);
        setCurrentUser(null);
      }
    }
  }

  function onResetClick() {
    
    let emptyList = [];
    let result = window.confirm(
      "Are you sure you want to reset the saved queries?"
    );
    if (result) {
      saveQueryList(emptyList);
      setSavedQueries(emptyList)
    }
  };


  return (
    <div>   
      <img 
          height={200}
          src="./newspaper.jpeg"
          alt="News at your finger tip"/>   
      <LoginForm login={login} 
        credentials={credentials} 
        currentUser={currentUser} 
        setCredentials={setCredentials} />
        
      <div >
        <section className="parent" >
          <div className={`box ${(currentUser) ? "visible" : "hidden"}`}>
            <span className='title'>Query Form</span>
            <QueryForm
              currentUser={currentUser}
              setFormObject={setQueryFormObject}
              formObject={queryFormObject}
              submitToParent={onFormSubmit} />
          </div>
          <div className="box">
          <span className='title'>Saved Queries</span>
          <SavedQueries savedQueries={savedQueries} 
          selectedQueryName={query.queryName}
          onQuerySelect={onSavedQuerySelect} 
          />
          <span className={`box ${(currentUser) ? "visible" : "hidden"}`} style={{ display: "block" }}>
          <button className="reset-button" type="button" onClick={onResetClick}>
            Reset Saved Queries
          </button>
          </span>
          </div>
          <div className="box">
            <span className='title'>Articles List</span>
            <Articles query={query} data={data} user={currentUser} />
          </div>
        </section>
      </div>
    </div>
    
  )
}