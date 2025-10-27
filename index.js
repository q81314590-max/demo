const express = require('express')
const app = express()
// parse JSON bodies
app.use(express.json());
// parse urlencoded form bodies (from HTML forms)
app.use(express.urlencoded({ extended: true }));
const port = 3001

const path = require('path');
const staticDir = path.join(__dirname, '..', 'e-commerce_website');
app.use(express.static(staticDir));

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

]
app.get('/', (req, res) => {
  res.send('Server is running!');
});
app.post('/signup', function(req, res) {
  // Decode body
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  // Check if user already exists
  const userExists = USERS.some(u => u.email === email);
  if (userExists) {
    return res.status(409).send('User already exists');
  }

  // Store email and password
  USERS.push({ email, password });

  // return back 200 status code to the client
  res.status(200).send('Signup successful!');
})

app.post('/login', function(req, res) {
  // decode body (works for JSON and form-encoded)
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(u => u.email === email);
  if (!user) {
    // user not found — send helpful status
    return res.status(404).send('User not found');
  }

  // Also ensure that the password is the same
  if (user.password !== password) {
    return res.status(401).send('Invalid password');
  }

  // On successful login, redirect the user to the home page
  return res.redirect('/');
})

app.get('/questions', function(req, res) {
  //return all the questions in the QUESTIONS array
  res.send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
  const { email } = req.body;
   // return the users submissions for this problem
   const userSubmissions = SUBMISSION.filter(s => s.email === email);
   res.send(userSubmissions);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
  const { email, problemTitle, solution } = req.body;
  const isAccepted = Math.random() < 0.5; // 50% chance of acceptance
  const submission = { email, problemTitle, solution, status: isAccepted ? "Accepted" : "Rejected" };
  SUBMISSION.push(submission);
   // Store the submission in the SUBMISSION array above
   res.send("Hello World from route 4!")
});

// leaving as hard todos


// Simple admin token for demonstration
const ADMIN_TOKEN = 'secret-admin-token';

// Route to let admin add a new problem
app.post('/add-problem', (req, res) => {
  // Check for admin token in headers
  const token = req.headers['x-admin-token'];
  if (token !== ADMIN_TOKEN) {
    return res.status(403).send('Forbidden: Admins only');
  }

  const { title, description, testCases } = req.body;
  if (!title || !description || !Array.isArray(testCases)) {
    return res.status(400).send('Missing required fields');
  }

  QUESTIONS.push({ title, description, testCases });
  res.status(201).send('Problem added successfully');
});

// Serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(staticDir, 'login.html'));
});

app.listen(port, function() {
  console.log(`Server running at http://localhost:${port}`)
})