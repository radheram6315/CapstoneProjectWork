export function Articles(params) {
    let articles = (params.data.articles)?params.data.articles:[];
    let queryName = (params.query.queryName)?params.query.queryName:"na";
    let queryDetails = (params.query.q)?params.query.q:"na";
    let articleCount = (params.data.totalResults)?params.data.totalResults:0;
    return (
      <div>
        Query: {queryName} 
        <br/>
        <button type="button" class = "button" data-toggle="collapse" data-target="#querydetails">click for queryDetails</button>
        <div class="collapse" id="querydetails"> {queryDetails}
        </div>
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