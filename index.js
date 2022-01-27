const routes = require('./routes');
const express = require('express');
// const publicPath = path.resolve(__dirname, "public");
const port = process.env.PORT || 3000;

const app = express()
app.get('/', routes.mainView);
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.listen(port);