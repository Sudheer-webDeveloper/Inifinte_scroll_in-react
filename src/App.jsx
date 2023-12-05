import './App.css'
import React, { useState,useRef,useCallback } from 'react'
import useBookSearch from './useBookSearch'

const App = () => {

  const [query,setQuery] = useState("")
  const [pageNumber,setPageNumber] = useState(1)
  const {error,books,loading,hasMore} = useBookSearch(query,pageNumber)

  
  // To Infinite scroll or pagination
  const observer = useRef() 
  const handleRef = useCallback((node)=>{
     if(loading) return 
     if(observer.current) observer.current.disconnect()
     observer.current = new IntersectionObserver(entries=>{
      console.log("entries",entries)
      if(entries[0].isIntersecting && hasMore){
        console.log("visible")
        setPageNumber((prevPage)=>{
          return prevPage+1
        })
      }
     })
     if(node) observer.current.observe(node)
     console.log(node) // this will return the last item there in the book array
  },[loading,hasMore])

  //When either loading or hasMore changes, the useCallback hook observes these changes and re-creates the handleRef function only if any of these dependencies change. If these variables affect the behavior or logic within handleRef, this ensures that the function uses the most up-to-date values of loading or hasMore whenever it's called.
   


  const handleChange = (e)=>{
      setQuery(e.target.value)
      setPageNumber(1) // when a new search is happening we are again start from first page right that's why we are updating the pageNumber here
      console.log("query is ", query,"pagenumber is",pageNumber)
  }



  return (
    <>
      <input type="text" placeholder='search...' value={query} onChange={handleChange}/>
      {books.map((book,index)=>{
        if(books.length === index + 1){
          return <div key={book} ref={handleRef}>{book}</div>
        }
        else{
         return <div key={book}>{book}</div>
        }
      })}
      <h4>{loading? "loading...": "success"}</h4>
      <h4>{error&&"error Occured"}</h4>

    </>
  ) 
}

export default App





/*

Certainly! This code you've shared is a part of an infinite scroll implementation using React's `useRef`, `useCallback`, and a `IntersectionObserver` to load more content as the user scrolls down. Let's break it down step by step:

```javascript
const observer = useRef(); // Creating a reference to store the observer
const handleRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
        console.log("entries", entries);
        if (entries[0].isIntersecting) {
            console.log("visible");
        }
    });
    console.log(node);
}, [loading, hasMore]);
```

1. **`useRef`**: This hook creates a mutable reference that persists across component renders. In this case, `observer` is created to store the `IntersectionObserver` object. It helps in keeping track of the last observed element during scrolling.

2. **`useCallback`**: This hook is used to memoize a function so that it's not recreated on every render unless its dependencies change. 
   - `handleRef` is a memoized function that operates as a reference callback.
   - Inside this function, it:
     - Checks if the component is in a loading state (`loading`). If it is, it stops further execution to avoid conflicts during loading periods.
     - Disconnects any existing observer if it's already set (`observer.current`) to ensure no conflicting or duplicate observers exist.
     - Creates a new `IntersectionObserver` instance. This observer observes elements in the DOM and fires a callback when they intersect with the viewport.
     - Logs the observed node, presumably the last item in the book array.

3. **Integration with JSX**:
   - The `handleRef` function is then used as a reference in the last `<div>` element inside the `books.map` function.
   - When the last item in the book array is rendered (`if (books.length === index + 1)`), the `ref={handleRef}` assigns the intersection observer to that specific element. This sets up the `IntersectionObserver` to watch the visibility of this specific element for scrolling purposes.

4. **Infinite Scroll**:
   - As the user scrolls and the last book element becomes visible in the viewport, the `IntersectionObserver` fires the callback (`if (entries[0].isIntersecting)`) to load more content or trigger the next set of actions needed for infinite scrolling (like fetching more data from an API).

This setup allows the application to react to the user scrolling to a certain point (the last book in this case), enabling the implementation of infinite scroll behavior by observing when specific elements enter the viewport.


*/



/*



Absolutely, let's break down the concepts related to the Intersection Observer and its functionalities.

### Intersection Observer:
The Intersection Observer is a JavaScript API that observes changes in the intersection of a target element with an ancestor element or with the top-level document's viewport. It's commonly used to implement features like lazy loading of images or infinite scrolling.

### `disconnect()` Method:
The `disconnect()` method is used to stop the `IntersectionObserver` from observing any further changes in the DOM. When called, it ceases the observing process, disconnecting it from all target elements.

### `entries` in Intersection Observer:
The `entries` parameter in the `IntersectionObserver` callback represents an array of `IntersectionObserverEntry` objects. Each entry describes one intersection change for one observed target element.

### `entries[0].isIntersecting`:
`entries[0].isIntersecting` is a property of the `IntersectionObserverEntry` object. It indicates whether the observed target element is intersecting the root (viewport or an ancestor) or not.

Example:

Let's say you have a simple scenario of observing a div element as it enters the viewport:

```javascript
// Create a new IntersectionObserver
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        console.log("Element is now visible");
        // Perform actions when the element is visible
    }
});

// Find the target element to observe
const targetElement = document.querySelector("#targetDiv");

// Start observing the target element
observer.observe(targetElement);
```

- **IntersectionObserver Setup**: Here, an observer is created to observe changes in the intersection of the `targetElement` (a div) with the viewport.

- **`entries[0].isIntersecting` Usage**: When the `targetElement` becomes visible in the viewport, the `IntersectionObserver` fires its callback. `entries` contains information about the observed elements. `entries[0].isIntersecting` is `true` when the `targetElement` enters the viewport, triggering the console log and any associated actions.

In your previous code:
- `observer.current = new IntersectionObserver((entries) => {...});`: Sets up an IntersectionObserver for observing elements.
- `if (entries[0].isIntersecting) {...}`: Inside the observer's callback, checks if the observed element (in this case, the last book in the list) is intersecting the viewport. If it is, it logs "visible" to the console, indicating it's currently visible to the user in the browser window.



*/