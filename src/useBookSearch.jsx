// A custom hook for to make network call

import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function useBookSearch(query,pageNumber) {

    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(false)
    const [books,setBooks] = useState([])
    const [hasMore,setHasMore] = useState(false)



    useEffect(()=>{
    setBooks([])
    },[query]) // when the query chnages with the previos searhed results data was staying there to avoid we are using this small useEffect 

 useEffect(()=>{
    let cancel
    setLoading(true)
    setError(false)
 axios({
    method:'GET',
    url:'http://openlibrary.org/search.json', //
    params:{q:query,page:pageNumber},  //http://openlibrary.org/search.json?q=Harry%20Potter&page=1
    cancelToken: new axios.CancelToken(call => cancel =call) //read the comment below why we are usoing cancel token here // If we don't use cancel Token here then for every letter changed in query we hit the api

 }).then((res)=>{
    console.log("for our ref",res.data)
    setBooks((prevBooks)=>{
        return [...new Set([...prevBooks,...res.data.docs.map((book)=>book.title)]) ]   // to avoid multiple titles to same we are using set and spreadingall the items into the array again
    })
    setHasMore(res.data.docs.length > 0) // returns true if there other false 
    console.log("hasmore",hasMore,res.data.docs.length)
    setLoading(false)

 }).catch((err)=>{

    if(axios.isCancel(err)) return 
    setError(error)
 })


 return ()=> cancel() // this plays the key role for cancelling the previos request and sets the present and sets our requested query.

 },[query,pageNumber])





  return {loading,error,books,hasMore}
   
}


/*

Scenario:

Let's imagine a user scenario where they're searching for books. They start by typing "Harry Potter" but then quickly change their mind and type "Lord of the Rings" before the "Harry Potter" search completes.
Example 1 Analysis:

    Using axios.isCancel(err): This code catches errors specifically due to canceled requests. When the user changes the search from "Harry Potter" to "Lord of the Rings," the axios.isCancel(err) check ensures that the error caused by canceling the "Harry Potter" request is ignored and doesn’t trigger further error handling logic. It allows the code to continue without additional handling for this specific situation.

Example 2 Analysis:

    Using console.log(err): Here, any error that occurs, including a canceled request error, is logged to the console. So, when the user changes the search from "Harry Potter" to "Lord of the Rings," the error caused by canceling the "Harry Potter" request is logged. If you have additional error handling logic after console.log(err), it would execute for this canceled request error, potentially leading to unnecessary error handling or confusing logs.

    Advantages:

    Example 1 (axios.isCancel(err)) Advantages:
        Specific Handling: It specifically handles canceled requests. This specificity helps maintain clarity and avoids unnecessary error handling logic for expected situations like canceled requests.
        Cleaner Code: It keeps the error handling focused on specific scenarios, making the code clearer and easier to understand.

    Example 2 (console.log(err)) Advantages:
        Generic Handling: It captures and logs all errors, including canceled requests. This can be advantageous if you need to log all errors for debugging purposes or if canceled requests might require further specific handling in your application.

In essence, using axios.isCancel(err) allows you to differentiate and specifically handle canceled requests, keeping your error handling more targeted and reducing noise in the logs or unnecessary handling for expected situations like canceled requests. On the other hand, using console.log(err) captures all errors, including canceled requests, which might be useful for comprehensive error tracking or if specific handling is needed for canceled requests in your application.

*/


/*
Sure, this code snippet is using the Axios library to make an HTTP GET request to the Open Library API (`http://openlibrary.org/search.json`). Let's break down each part of the code:

```javascript
axios({
    method: 'GET',
    url: 'http://openlibrary.org/search.json',
    params: { q: query, page: pageNumber }
}).then((res) => {
    console.log(res)
})
```

1. `axios({ ... })`: This is an Axios function call, where you pass an object containing configuration options for the HTTP request.

2. `method: 'GET'`: Specifies the HTTP method used for the request, which in this case is a GET request. 

3. `url: 'http://openlibrary.org/search.json'`: Defines the URL where the GET request is being sent. This URL points to the Open Library API's search endpoint (`http://openlibrary.org/search.json`).

4. `params: { q: query, page: pageNumber }`: This is an object passed as the `params` property in the Axios configuration. It contains query parameters sent along with the GET request. `q` represents the search query, and `page` represents the page number for paginating the results. The values `query` and `pageNumber` are variables that should be defined earlier in your code, holding the specific values you want to search for and the page number you want to retrieve, respectively.

5. `.then((res) => { console.log(res) })`: This is a promise-based syntax used to handle the response after the HTTP request is completed. When the request is successful, the `then()` method is triggered with a callback function that logs the response (`res`) to the console. The response object (`res`) contains data returned by the Open Library API.

If you were to provide specific values for `query` and `pageNumber`, for instance, `query = 'Harry Potter'` and `pageNumber = 1`, the resulting URL for the request would be: 

`http://openlibrary.org/search.json?q=Harry%20Potter&page=1`

This URL includes the base URL along with the query parameters. The `q` parameter is set to 'Harry Potter' (encoded as 'Harry%20Potter' due to the space, since URLs cannot contain spaces directly) and the `page` parameter is set to 1.

This request would fetch the first page of search results for the query 'Harry Potter' from the Open Library API.


*/




/*

Absolutely, let's simplify this!

Imagine you're at a restaurant and you've ordered food. Now, suddenly, you decide you want to cancel that order because you changed your mind or you want to order something else.

In the code you provided:
```javascript
let cancel;
axios({
    method: 'GET',
    url: 'http://openlibrary.org/search.json',
    params: { q: query, page: pageNumber },
    cancelToken: new axios.CancelToken(call => cancel = call)
}).then((res) => {
    console.log(res);
});

return () => cancel();
```

The `cancelToken` here is like having a waiter who listens specifically to you saying, "Hey, if the kitchen hasn’t started making my order yet, just cancel it, please!"

- **The waiter**: Think of the waiter as the `cancelToken`. It's a special token you hold onto that allows you to cancel your request.
  
- **Your order**: The Axios request (`axios({...})`) is like placing your order at the restaurant. You're asking the Open Library API to give you information based on your search query (`query`) and the page number (`pageNumber`).

- **The cancellation function (`cancel`)**: This is your ability to tell the waiter to cancel your order. When you leave the restaurant or change your mind about your order (when the component unmounts or when `query` or `pageNumber` changes), you hand over this ability to the waiter (`return () => cancel();`). The waiter will then cancel your order (cancel the Axios request) if it hasn't been fulfilled yet.

So, the cancel token (`cancelToken`) gives you the power to cancel your request if you need to, just like telling the waiter to cancel your food order if it hasn't been prepared yet. This way, if you're no longer interested in the previous search (maybe you started typing a new search term), you can cancel the ongoing request to prevent unnecessary work and waiting for a response that you don't need anymore.


*/



/*


Certainly! Let's relate the cancel token to the text input and how the API works with the `onChange` event.

In your code:
```javascript
const handleChange = (e) => {
    setQuery(e.target.value);
    setPageNumber(1); // Resetting pageNumber to 1 when a new search is triggered
}
```

This `handleChange` function is linked to the `onChange` event of an input field. When you type in the input field, this function is called every time the value changes.

Now, consider a scenario:

1. **You start typing a search term**: As you type into the input field, the `handleChange` function updates the `query` state with the current value being typed (`setQuery(e.target.value)`). For example, typing "Harry Potter" sets `query` to "Harry Potter".

2. **The API request**: As the `query` state changes, the `useEffect` hook is triggered due to the `[query, pageNumber]` dependency array. This hook contains an Axios request to the Open Library API based on the `query` and `pageNumber`.

3. **Cancel Token relevance**: Now, imagine you've typed "Harry Potter" but then suddenly start typing something else, like "Lord of the Rings", before the previous request completes. At this point, the `setQuery` updates the `query` state to "Lord of the Rings" and sets `pageNumber` back to `1` (`setPageNumber(1)`).

4. **Cancellation in action**: Since the `query` state changed, the `useEffect` hook reruns. However, the previous request might still be ongoing, searching for "Harry Potter". But because of the cancellation setup using the cancel token, the previous incomplete request for "Harry Potter" is canceled when the `query` changes to "Lord of the Rings". This prevents unnecessary load or confusion from multiple pending requests for different searches.

The cancel token helps in managing these scenarios by ensuring that if a new search term is entered before the previous request completes, it cancels the ongoing request related to the previous search term. This way, the application focuses on the most recent search term entered by the user, providing relevant and timely results without being confused by outdated or unnecessary requests.


*/