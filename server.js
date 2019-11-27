const express = require('express');
const path = require('path');
const nomeApp = process.env.npm_package_name;
const app = express();
 
app.use(express.static(`$/dist/teste-jurema/`));
 
app.get('/*', (req, res) => {
res.sendFile(path.join(`$/dist/teste-jurema/index.html`));
});
 
app.listen(process.env.PORT || 8080);