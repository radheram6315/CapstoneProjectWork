
import { QueryForm } from './QueryForm';
import { Articles } from './Articles';
import { useState, useEffect } from 'react';
import { exampleQuery ,exampleData } from './data';
import { SavedQueries } from './SavedQueries';

const urlNews="/news"
export function NewsReader() {
  const [query, setQuery] = useState(exampleQuery); // latest query send to newsapi
  const [data, setData] = useState(exampleData);   // current data returned from newsapi
  const [queryFormObject, setQueryFormObject] = useState({ ...exampleQuery });
  const [savedQueries, setSavedQueries] = useState([{ ...exampleQuery }]);

  useEffect(() => {
    getNews(query);
  }, [query])

  function onSavedQuerySelect(selectedQuery) {
 setQueryFormObject(selectedQuery);
 setQuery(selectedQuery);
}

  function onFormSubmit(queryObject) {
    let newSavedQueries = [];
    newSavedQueries.push(queryObject);
    for (let query of savedQueries) {
      if (query.queryName !== queryObject.queryName) {
        newSavedQueries.push(query);
      }
    }
    console.log(JSON.stringify(newSavedQueries));
    setSavedQueries(newSavedQueries);    
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

  return (
    <div>
      <div >
        <section className="parent" >
          <div className="box">
            <span className='title'>Query Form</span>
            <QueryForm
              setFormObject={setQueryFormObject}
              formObject={queryFormObject}
              submitToParent={onFormSubmit} />
          </div>
          <div className="box">
          <span className='title'>Saved Queries</span>
          <SavedQueries savedQueries={savedQueries} 
          selectedQueryName={query.queryName}
          onQuerySelect={onSavedQuerySelect} />
          </div>
          <div className="box">
            <span className='title'>Articles List</span>
            <Articles query={query} data={data} />
          </div>
        </section>
      </div>
    </div>
  )
}