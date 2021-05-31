/*
 * Passport default set
 * 참고 : 생활코딩
 */

var local_login = require('./passport/local_login');
var local_signup = require('./passport/local_signup');


module.exports = (app, passport) => {
	console.log('config/passport 호출됨.');
	
	//이 부분 추후 손볼것. -05.23
	var auth = [
		{local_login: require('./passport/local_login')},
		{local_signup: require('./passport/local_signup')}
	];

	
	//serializeUser 메서드는 로그인에 성공했을 때 전달한 authData 객체를 콜백 함수의 첫 번째 인자로 전달받는다.
    passport.serializeUser( (user, done) => {
        console.log('serializeUser', user);
		
		/* 
		 * 전달받은 사용자 정보를 내부적으로 세션에 기록한다.
		 * 세션에 기록하는 일은 done 함수가 수행.
		 * done 함수의 첫 번째 인자로는 null, 두 번째 인자로는 사용자를 구별하는 식별자를 전달함. 
		 */ 
        done(null, user);  
    }); 

    // deserializeUser 메서드는 페이지에 방문할 때마다 호출되게 약속돼있다.
    // 사용자가 각 페이지에 방문할 때마다 세션에 기록된 데이터(user)를 기준으로 deserializeUser 메서드를 호출해 로그인 여부를 확인
    passport.deserializeUser( (user, done) => {
        console.log('deserializeUser', user);
		
        // 두 번째 파라미터로 지정한 사용자 정보는 req.user 객체로 복원됨
        done(null, user);  
    });

	// 인증방식 설정
	passport.use('local-login', local_login);
	passport.use('local-signup', local_signup);
	console.log(auth.length,'가지 passport 인증방식 설정됨.');
	
};