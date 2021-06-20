/*
 * posting 기능 관련 라우터 정리
 * -- 김정호
 */

var funcs = require('./func/postFunc');

module.exports = (app, router, path) => {
	
	console.info("posting router 실행됨.");
	
	router.get('/addpost', (req, res) => {
		console.log("/addpost 요청됨.");
		
		funcs.addPost(req, res);
	});
	
	//image upload를 위해 multer를 middleware로 동작
	router.post('/process/addpost', (req, res) => {
		console.log('/process/addpost 요청됨.');
		
		funcs.processAddpost(req, res);
	});
	
	/**
	 * listpost에선 페이징한 게시물을 끊어서 보내고, 클라이언트 측에선 하단에 도착 시마다 몇 페이지까지 로드된 상태인지 전달해야한다.
	 * 필요 시 추가로 ejs파일 하나를 만들 것.
	 */
	router.get('/listpost', (req, res) => {
		console.log("/listpost 요청됨.");
		
		funcs.listpostFunc(req, res);
	});
	
	// 검색기능 --indexing X 추후 고려
	router.get('/process/search', (req, res) => {
		console.log("/process/search 요청됨.");
		
		funcs.processSearch(req, res);
	});	
	
	router.get('/process/showpost/:id', (req, res) => {
		console.log("/process/showpost 요청됨.");
		
		funcs.showpostFunc(req, res);
	})
	
	router.post('/process/addcomment', (req, res) => {
		console.log("/process/addcomment 요청됨.");
		
		funcs.processAddComment(req, res);
	});
	
	router.post('/edit/:id', (req, res) => {
		console.log("/edit 요청됨.");
		
		funcs.editPost(req, res);
	});
	
	router.post('/process/edit/', (req, res) => {
		console.log("/process/edit 요청됨.");
		
		funcs.processEditPost(req, res);
		
	});
	
	router.delete('/process/delete', (req, res) => {
		console.log("/process/delete 요청됨.");
		
		funcs.processDeletePost(req, res);
	});
	
	//댓글 삭제, 수정 기능 구현
	router.post('/process/removeComment', (req, res) => {
		console.log("/process/removeComment 요청됨.");
		
		funcs.processRemoveComment(req, res);
	});
	
	router.post('/modifyComment', (req, res) => {
		console.log("/modifyComment 요청됨.");
		
		funcs.modifyComment(req, res);
	});
	
	router.post('/process/modifyComment', (req, res) => {
		console.log("/process/modifyComment 요청됨.");
		
		funcs.processModifyComment(req, res);
	});
	
};