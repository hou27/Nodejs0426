/*
 * posting 기능 관련 라우터 정리
 */

module.exports = (router) => {
	console.log("posting router 실행됨.");
	router.get('/addpost', (req, res) => {
		console.log("/addpost 요청 패스됨.");
		if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('addpost.ejs', {login_success:false});
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('addpost.ejs', {login_success:true, user: req.user});
        }
	});
}