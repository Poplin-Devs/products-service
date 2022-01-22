const app = require('./app.js');
const port = process.env.EXPRESS_PORT || 3000;



app.listen(port, () => {
  console.log(`Express: listening on ${port}`);
});