var path = require('path')
	, utils = require('../../utils/utils')

exports.addLayout = (req, res) => {
	console.log("addLayout in renderFunc 요청됨.");
	
	var context = {
			user: req.user,
			login_success: true,
			layoutInfo: false,
			arritem: utils.navactive(req.path),
			message: req.flash()
		};
	
	if(req.isAuthenticated()){
		res.render('secondeditor.ejs', context, (err, results) => {
			if (err) {
				console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
				res.write('<p>' + err.stack + '</p>');
				res.end();

				return;
			}
			else
				res.send(results);
		});
	}else{
		return res.redirect('/login'); 
	}
}

exports.processAddLayout = (req, res) => {
	console.log("processAddLayout in renderFunc 요청됨.");
	
	//일단 급하게 해놓느라 secondeditor.ejs에서 데이터를 보내는 부분은 구현하지 않았고 게시판, 공지사항, 이미지박스 등 여러개를 저장해야할 때의 경우도 구현 x.
	//div태그 하위에 form 태그를 추가하여 요소를 추가할 시 form 내부로 추가되도록 수정, 해당 데이터들을 serialize하여 전송해볼 예정임.
	const userId = req.user
	// let layout = [{	// 요소
	//     	positionLeft: req.body.content.positionLeft,
	// 		positionTop: req.body.content.positionTop,
	//     	style: ""
	//     }];
	
	let layout = req.body.layout
		,layoutName = req.body.layoutName;
	// if(req.body.content.style) {	// style은 한줄의 문자열로 가공하여 한방에 추가한다고 가정함.
	// 	layout.style = req.body.content.style;
	// }

	var database = req.app.get('database');

	// 데이터베이스 객체가 초기화된 경우
	if (database.db) {

		var layoutContents = new database.LayoutModel({
			userId,	// 유저와 연결해야하므로 필요
			layoutName,
			layout,				// layout 정보
			login_success: true,	// 그냥 혹시나 해서 추가한 두 항목 나중에 진행하면서 필요없으면 뺄 예정
			message: req.flash()	// 
		});

		layoutContents.saveLayout( (err, result) => {
			if (err) {
				console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
				res.write('<p>' + err.stack + '</p>');
				res.end();

				return;
			}
			console.log(result);
			console.log("레이아웃 추가함.");

			database.UserModel.findByIdAndUpdate(userId,
			{'$push': {'customedLayout':{'layout':result._id}}},
			{'new':true, 'upsert':true},
			(err, results) => {
				console.log('레이아웃 추가 성공.');
				res.send(result.layout);
			});
		});

	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
}

exports.processEditLayout = (req, res) => {
	console.log("processEditLayout in renderFunc 요청됨.");
	
	const userId = req.user
	
	let layout = req.body.layout
		,layoutId = req.body.layoutId
		,layoutName = req.body.layoutName;

	var database = req.app.get('database');

	if (database.db) {
		database.LayoutModel.findOneAndUpdate({_id : layoutId},
			{$set:{layoutName, layout, updated_at: new Date()}}, (err, results) => {
			if (err) {
				console.error('수정 중 에러 발생 : ' + err.stack);
				res.status(500);
				throw err;
			}

			if (results) {
				console.log('레이아웃 수정 완료', results);
				res.status(200);
				res.send(results);
			}
		})
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
}

exports.myLayout = (req, res) => {
	console.log("myLayout in renderFunc 요청됨.");
	if(req.isAuthenticated()){
		var database = req.app.get('database');
		var layoutLength = req.user.customedLayout.length;
		console.log('why not ::: ',req.user)
		
		// 데이터베이스 객체가 초기화된 경우
		if (database.db) {

			async function getLayouts(chdkey, i) {
				await database.LayoutModel.findById(req.user.customedLayout[i].layout, (err, layout) => {
					chdkey.layouts.push(layout);
					console.log("해당 layout : ",chdkey.layouts[i]);
				});

			}

			//작성 시간, 작성자 값 재설정
			async function chkey() {
				
				var chdkey = {
					layouts: []
				}


				console.log(layoutLength);
				for (var i = 0; i < layoutLength; i++) {
					await getLayouts(chdkey, i);
				}
				return chdkey;
			}
			async function getMyLayouts() {
				let chdkey = await chkey();

				var context = {
						user: req.user,
						myLayout: chdkey.layouts,
						login_success: true,
						arritem: utils.navactive(req.path),
						message: req.flash()
					};
				console.log(chdkey.layouts);
				res.render('myLayout.ejs', context, (err, results) => {
					if (err) {
						console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

						res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
						res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
						res.write('<p>' + err.stack + '</p>');
						res.end();

						return;
					}
					else
						res.send(results);
				});
			}

			getMyLayouts();
			
		} else {
			res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
			res.write('<h2>데이터베이스 연결 실패</h2>');
			res.end();
		}
		

		
	}else{
		return res.redirect('/login'); 
	}
}

exports.processShowLayout = (req, res) => {
	// URL 파라미터로 전달됨
	var paramId = req.body.id || req.query.id || req.params.id;

	console.log('요청 파라미터 : ' + paramId);

	// html-entities module is required in showpost.ejs
	//var Entities = require('html-entities').AllHtmlEntities;

	var database = req.app.get('database');

	// 데이터베이스 객체가 초기화된 경우
	if (database.db) {
		// 1. 글 리스트
		database.LayoutModel.findById(paramId, (err, results) => {
			if (err) {
				console.error('게시판 글 조회 중 에러 발생 : ' + err.stack);

				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>게시판 글 조회 중 에러 발생</h2>');
				res.write('<p>' + err.stack + '</p>');
				res.end();

				return;
			}
			console.log('check this value ::: ',results);
			if (results) {
				
				var context = {
					user: req.user,
					login_success: true,
					layoutInfo: results,
					arritem: utils.navactive(req.path),
					message: req.flash()
				};
				
				res.render('secondeditor.ejs', context);
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>레이아웃 조회 실패</h2>');
				res.end();
			}
		});
	}
	else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
}