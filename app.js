/*
 * 메인 js 파일
 * -- 김정호
 */


var express = require('express')
	, http = require('http')
	, path = require('path');

var cookieParser = require('cookie-parser')
	, static = require('serve-static')
	, errorHandler = require('errorhandler')
	, expressErrorHandler = require('express-error-handler');

const expressSession = require('express-session');
//var FileStore = require('session-file-store')(expressSession);

const passport = require('passport');

/*
 * 모듈화한 것들
 */

//설정 파일
var config = require('./config/config');

//데이터베이스
var database = require('./database/database');

//라우팅 정보
//var route_loader = require('./router/route_loader');

const flash = require('connect-flash');

var app = express();

//view engine 설정
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


//===== 서버 변수 설정 및 static으로 public 폴더 설정  =====//
//포트 닉네임 설정
console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || 3000);
 

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(express.urlencoded({ extended: true }))

// body-parser를 이용해 application/json 파싱
//app.use(bodyParser.json())

// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));
 
// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(expressSession({
	secret:'nodejshou',
	resave:true,
	saveUninitialized:true,
	//store:new FileStore()
}));



/*
 * ===== Passport 사용 설정 =====//
 * Passport는 내부적으로 세션을 사용하므로 반드시 passport와 관련된 세션을 활성화시키는 코드가 필요함.(생활코딩)
 */ 
//passport.js를 초기화하는 미들웨어
app.use(passport.initialize());
//세션도 사용하므로 express에 설치
app.use(passport.session());
//flash는 express.Router()보다 먼저 와야함.
app.use(flash());
 

/*
 * 라우팅 정보를 읽어들여 라우팅 설정
 * 사실 express.Router()를 사용하지 않아도
 * app.get('*', 미들웨어)등과 기능은 동일.
 * 그러나 코드 관리를 위해 라우터를 별도로 분리함.
 * 출처: https://backback.tistory.com/341
 */
var router = express.Router();
//05-23 posts의 내용을 posting으로 옮기며 하나하나 재설정 중
//route_loader.init(app, router);

//포스팅 기능 라우팅 설정
var postRouter = require('./router/posting');
postRouter(app, router, path);

//패스포트 인증방식 설정
var configPassport = require('./config/passport');
configPassport(app, passport);

//패스포트 관련 라우팅 설정
var userPassport = require('./router/user_passport');
userPassport(router, passport);

//favicon 요청 무시
app.get('/favicon.ico', (req, res) => res.status(204));

app.use(router);

//404 에러 페이지
var errorHandler = expressErrorHandler({
 static: {
   '404': './public/404.html'
 }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );


//-----------서버 시작-----------

//확인되지 않은 예외 처리 - 서버 프로세스 종료하지 않고 유지함
process.on('uncaughtException', (err) => {
	console.log('uncaughtException 발생함 : ' + err);
	console.log('서버 프로세스 종료하지 않고 유지함.');
	
	console.log(err.stack);
});

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', () => {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', () => {
	console.log("Express 서버 객체가 종료됩니다.");
	if (database.db) {
		database.db.close();
	}
});

// 시작된 서버 객체를 리턴
var server = http.createServer(app).listen(app.get('port'), () => {
	console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
	// 데이터베이스 초기화
	database.init(app, config);
});