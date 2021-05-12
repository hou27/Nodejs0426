const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));


app.listen(3000, () => {
	console.log('listening on 3000');
})

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
})