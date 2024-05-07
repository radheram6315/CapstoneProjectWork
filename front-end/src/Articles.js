export function Articles(params) {
    let articles = (params.data.articles)?params.data.articles:[];
    let queryName = (params.query.queryName)?params.query.queryName:"na";
    let queryDetails = (params.query.q)?params.query.q:"na";
    let queryLanguage = (params.query.q)?params.query.language:"na";
    let querySize = (params.query.q)?params.query.pageSize:"na";
    let articleCount = (params.data.totalResults)?params.data.totalResults:0;
    console.log(params.user)
    return (
      <div>
        Query: {queryName} 
        <br/>
        <button type="button" class = "details" data-toggle="collapse" data-target="#querydetails">click for queryDetails</button>
         <div class="collapse" id="querydetails"> details:{queryDetails} | language:{queryLanguage} | Size:{querySize}</div>
        <br/>Count: {articleCount}
        <ol >{
            articles.map((item, idx) => {
              if(item){
                if(item.title){
                  if(item.title === "[Removed]"){
                    return (<li key={idx} >Was Removed</li>);
                  }
                  return (<li key={idx}>{item.title}<a href={item.url} target="_blank" rel="noreferrer" >&nbsp;{item.url}</a></li>);    
                }else{
                  return (<li key={idx}>No Title</li>);
                }
              }else{
                return (<li key={1} >No Item</li>);
              }
            })
        }</ol>
      </div>
    )
  
  }