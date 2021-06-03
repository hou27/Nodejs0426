/**
 * 패스포트 라우팅 함수 정의
 *
 * @date 2016-11-10
 * @author Mike
 */
  
module.exports = (router, passport) => {
    console.log('user_passport 호출됨.');

	//탭별 navactive class 추가
	var navactive = (path) => {
		
		var itemactive = 'nav-item active', arritem = ['nav-item', 'nav-item', 'nav-item'];
		switch (path) {
			case '/':
				arritem[0] = itemactive;
				break;
			case '/addpost':
				arritem[1] = itemactive;
				break;
			case '/listpost' :
			case '/process/search' :
				arritem[2] = itemactive;
				break;
			default:
				break;
		}
		return arritem;
	}
	
    // 홈 화면
    router.get('/', (req, res) => {
        console.log('/ 요청됨.');

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('home.ejs', {login_success:false, arritem: navactive(req.path)});
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('home.ejs', {login_success:true, user: req.user, arritem: navactive(req.path)});
        }
    });
    
    // 로그인 화면
    router.get('/login', (req, res) => {
        console.log('/login 요청됨.');
		// 인증 안된 경우
		
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('login.ejs', {message: req.flash('loginMessage'), login_success:false, arritem: navactive(req.path)});
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('login.ejs', {message: req.flash('loginMessage'), login_success:true, user: req.user, arritem: navactive(req.path)});
        }
    });
	 
    // 회원가입 화면
    router.route('/signup').get( (req, res) => {
        console.log('/signup 요청됨.');
		// 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('signup.ejs', {message: req.flash('signupMessage'), login_success:false, arritem: navactive(req.path)});
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('signup.ejs', {message: req.flash('signupMessage'), login_success:true, user: req.user, arritem: navactive(req.path)});
        }
    });
	 
    // 프로필 화면
    router.route('/profile').get(function(req, res) {
        console.log('/profile 요청됨.');

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');

            if (Array.isArray(req.user)) {
                res.render('profile.ejs', {user: req.user, login_success:true, arritem: navactive(req.path)});
            } else {
                res.render('profile.ejs', {user: req.user, login_success:true, arritem: navactive(req.path)});
            }
        }
    });
	
    // 로그아웃
    router.route('/logout').get(function(req, res) {
        console.log('/logout 요청됨.');
        req.logout();
		//즉시 로그아웃되지 않고, 한참 있다가 새로 고침했을 때 로그아웃되는 현상 해결
		//콘솔 오류 방지를 위해 destroy에서 save로 대체
		req.session.save( (err) => {
			res.redirect('/');
		});
    });


    // 로그인 인증
    router.route('/login').post(passport.authenticate('local-login', {
        successRedirect : '/profile', 
        failureRedirect : '/login', 
        failureFlash : true 
    }));	

    // 회원가입 인증
    router.route('/signup').post(passport.authenticate('local-signup', {
        successRedirect : '/profile', 
        failureRedirect : '/signup', 
        failureFlash : true 
    }));

};