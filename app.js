const express = require('express')
  , http = require('http');
const app = express();
//const bodyParser = require('body-parser');

var database = require('./database/database');

//설정파일
var config = require('./config/config');

// 모듈로 분리한 라우팅 파일 불러오기
var route_loader = require('./router/route_loader');

/*
 * 라우팅 정보를 읽어들여 라우팅 설정
 * express.Router()를 사용할 필요 없이
 * app.get('*', 미들웨어)등과 기능은 동일.
 * 그러나 코드 관리를 위해 라우터를 별도로 분리함.
 * 출처: https://backback.tistory.com/341
 */
var router = express.Router();
route_loader.init(app, router);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));


app.listen(3000, () => {
	console.log('listening on 3000');
})

app.get('/', (req, res) => {
	res.render('home.ejs');
})

app.get('/write', (req, res) => {
	res.render('write.ejs');
})

app.get('/login', (req, res) => {
	res.render('login.ejs');
})

app.get('/signin', (req, res) => {
	res.render('signin.ejs');
})

app.get('/mypage', (req, res) => {
	res.render('mypage.ejs');
})

app.post('/process/write', (req, res) => {
	console.log("글 작성 진행");
	console.log(req.body);
	res.redirect('/');
})

// 시작된 서버 객체를 리턴
var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

	// 데이터베이스 초기화
	database.init(app, config);
   
});