//Global Imports
const express = require('express');
const cors = require('cors');

//Route Imports
const userCredentialsRouter = require('./routes/users/credentials');
const envRouter = require('./routes/utils/env');

const app = express();
app.use(cors());  
app.use(express.json());

app.use('/api/users/credentials', userCredentialsRouter);
app.use('/api/environment', envRouter);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});