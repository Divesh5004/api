
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// API endpoint for issuing commercial paper

app.post('/issue-commercial-paper', (req, res) => {
  try {
    // Extract the request parameters from the HTTP request body
    const { issuer, paperNumber, issueDate, maturityDate, faceValue } = req.body;

    // Perform the necessary logic here
    // ...

    // Return the success response
    res.status(200).json({ message: 'Commercial paper issued successfully' });
  } catch (error) {
    // Handle errors and return a meaningful response
    console.log('Error processing request:', error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
});

// Start the API server
app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});


// const express = require('express');
// const app = express();
// const port = 3000;

// // API endpoint for issuing commercial paper
// app.post('/issue-commercial-paper', (req, res) => {
//   try {
//     // Extract the request parameters from the HTTP request body
//     const { issuer, paperNumber, issueDate, maturityDate, faceValue } = req.body;

//     // Perform the necessary logic here
//     // ...

//     // Return the success response
//     res.status(200).json({ message: 'Commercial paper issued successfully' });
//   } catch (error) {
//     // Handle errors
//     console.log(`Error processing request. ${error}`);
//     res.status(500).json({ error: 'An error occurred while processing the request' });
//   }
// });

// // Start the API server
// app.listen(port, () => {
//   console.log(`API server is running on port ${port}`);
// });

