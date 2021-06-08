/*
 * socket 기능 관련 라우터 정리
 * -- 김정호
 */



module.exports = (app, router) => {
	
	console.log("chating router 실행됨.");
	
	//탭별 navactive class 추가
	var navactive = (path) => {
		var itemactive = 'nav-item active', arritem = ['nav-item', 'nav-item', 'nav-item'];
		switch (path) {
			case '/':
				arritem[0] = itemactive;
				break;
			case '/addpost' :
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
	
	router.get('/chat', (req, res) => {
		console.log('/chat 요청됨.');
		
		if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('chat.ejs', {login_success:false, arritem: navactive(req.path)});
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('chat.ejs', {login_success:true, user: req.user, arritem: navactive(req.path)});
        }
	});
	
	router.get('/chatpage', (req, res) => {
		console.log('/chat 요청됨.');
		
		if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('chatpage.ejs', {login_success:false, arritem: navactive(req.path)});
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('chatpage.ejs', {login_success:true, user: req.user, arritem: navactive(req.path)});
        }
	});
	
};