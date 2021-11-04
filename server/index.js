const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const routes = require('./routes');

app.use('/api', routes);

const port = process.env.SERVER_PORT || 5000;

// app.use(express.static(publicWeb));
// console.log(`serving ${publicWeb}`);
// app.use('/api', routes);
// app.get('*', (req, res) => {
//   res.sendFile(`index.html`, { root: publicWeb });
// });

// const port = process.env.SERVER_PORT;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));