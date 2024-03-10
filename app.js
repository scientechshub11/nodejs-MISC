const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

require('dotenv').config()
const port = process.env.port || 5000
app.listen(port, ()=>{
    console.log(`app listen to the port ${port}`)
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/health-check', (req, res)=>{
    res.json({
        success:"message for health check!!!!!!",
        code:"200"
    })
})
// index.js

// Dummy database for users
const users = [
    { id: 1, username: 'user1', password: '$2a$10$1wbNTDY5dTyLzmouZLtzc.LypoC301qp5ek2kHbuxywHMNt2GdybC' }, // hashed password for 'password1'
  ];
  
app.post('/login', async(req, res) => {
    let { username, password } = req.body;
    const user = users.find(u => u.username === username);
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      console.log(password)
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      if (!result) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
      
      const token = jwt.sign({ userId: user.id , env: process.env.env}, 'your-secret-key', { expiresIn: '1h' }); // Change 'your-secret-key' to your actual secret key
      res.status(200).json({ message: 'Login successful', token });
    });
});
  
  

// Middleware function to verify JWT
function verifyToken(req, res, next) {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
  
    jwt.verify(token, 'your-secret-key', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }
      req.userId = decoded.userId;
      next();
    });
  }
  
  // Example protected route
  app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Protected route accessed successfully' });
  });
  