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
	
	router.post('/process/editLayout', (req, res) => {
		console.log("processEditLayout 요청됨.");
		
		funcs.processEditLayout(req, res);
	});
	
	router.get('/myLayout', (req, res) => {
		console.log("myLayout 요청됨.");
		
		funcs.myLayout(req, res);
	});
	
	router.get('/process/showLayout/:id', (req, res) => {
		console.log("processShowLayout 요청됨.");
		
		funcs.processShowLayout(req, res);
	});
};