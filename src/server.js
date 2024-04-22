// Import Express.js
import express from 'express'
// Import body-parser
import bodyParser from 'body-parser'

// This variable defines the port of your computer where the API will be available
// PORT come from process.env and is defined in the .env file
const PORT = process.env.PORT

// This variable instantiate the Express.js library
const app = express()

// Indicate to Express.js that you're using an additional plugin to treat parameters
app.use(bodyParser.json())

// The code below starts the API with these parameters:
// 1 - The PORT where your API will be available
// 2 - The callback function (function to call) when your API is ready
app.listen(PORT, () =>
  console.log(`The Books API is running on: http://localhost:${PORT}.`)
)

// The code below creates a GET route with these parameters:
// 1 - The route where the code will be executed
// 2 - The function containing the code to execute
app.get('/', (request, response) => {
    response.send('Welcome on the books API! Take a breath and start using it!')
  })


  // Static variable containing your books
let bookList = [
    'Make Time: How to Focus on what Matters Every Day',
    'The Power Of Habit',
  ]
  
// Replace the route name
app.get('/books', (request, response) => {
    // The function will return your bookList in a JSON
    // Sample: { allBooks: ["Make Time: How to Focus on what Matters Every Day", "The Power Of Habit"]}
    return response.json({ allBooks: bookList })
})

// Replace the GET method by POST
// Reminder: POST in the API world is used to ADD a data
app.post('/books', (request, response) => {
    // We get the parameter 'name' from the body
    const bookName = request.body.name
  
    // We check if the book list includes the new book
    // If it is, we return 'false'
    if (bookList.includes(bookName)) return response.json({ success: false })
  
    // Otherwise, we add the new book in the list and return 'true'
    bookList.push(bookName)
    return response.json({ success: true })
  })

  app.delete('/books', (request, response) => {
    // We get the parameter 'name' from the body
    const bookToDelete = request.body.name
  
    // We create a new array with all elements different from the book to delete
    bookList = bookList.filter((book) => book !== bookToDelete)
  
    // We return the new list
    return response.json({ allBooks: bookList })
  })

  app.put('/books', (request, response) => {
    // We get the parameters 'nameToUpdate' and 'updatedName' from the body
    const bookToUpdate = request.body.nameToUpdate
    const updatedBook = request.body.updatedName
  
    // We search if the book to update is in the list
    const indexOfBookToUpdate = bookList.findIndex(
      (book) => book === bookToUpdate
    )
  
    // If it is not a book from the list, we return 'false'
    if (indexOfBookToUpdate === -1) return response.json({ success: false })
  
    // Otherwise, we replace the name and return 'true'
    bookList[indexOfBookToUpdate] = updatedBook
    return response.json({ success: true })
  })