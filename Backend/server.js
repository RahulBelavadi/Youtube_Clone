const app = require('./app');

const PORT = process.env.PORT || 5000;
require('dotenv').config(); // This must be at the very top


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

