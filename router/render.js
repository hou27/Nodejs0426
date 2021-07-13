/*
 * render 기능 관련 라우터 정리
 */

var funcs = require('./func/renderFunc');

module.exports = (app, router, path) => {
	
	console.info("render router 실행됨.");
	
	router.get('/addLayout', (req, res) => {
		console.log("addLayout 요청됨.");
		
		funcs.addLayout(req, res);
	});
	
	router.post('/process/addLayout', (req, res) => {
		console.log("processAddLayout 요청됨.");
		
		funcs.processAddLayout(req, res);
	});
};