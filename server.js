const express = require('express');
const path = require('path');
const app = express();

// Serve static files (HTML, Excel, etc.)
app.use(express.static(path.join(__dirname)));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
