/*
 * posting 기능 관련 라우터 정리
 * -- 김정호
 */

module.exports = (app, router) => {
	console.log("posting router 실행됨.");
	
	router.get('/addpost', (req, res) => {
		console.log("/addpost 요청 패스됨.");
		req.flash('loginRequired', '로그인 후 이용할 수 있는 기능입니다.');
		if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('addpost.ejs', {login_success:false, message: req.flash('loginRequired')});
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('addpost.ejs', {login_success:true, user: req.user, message: req.flash()});
        }
	});
	
	router.post('/process/addpost', (req, res) => {
		console.log('/process/addpost 요청 패스됨.');
		
		var paramTitle = req.body.title;
		var paramContents = req.body.contents;
		var paramWriter = req.user;

		console.log('요청 파라미터 : ' + paramTitle + ', ' + paramContents + ', ' + paramWriter.name);

		var database = req.app.get('database');

		// 데이터베이스 객체가 초기화된 경우
		if (database.db) {

			// 1. 아이디를 이용해 사용자 검색
			database.UserModel.findByEmail(paramWriter.email, (err, results) => {
				console.log(results);
				if (err) {
					console.error('게시판 글 추가 중 에러 발생 : ' + err.stack);

					res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
					res.write('<h2>게시판 글 추가 중 에러 발생</h2>');
					res.write('<p>' + err.stack + '</p>');
					res.end();

					return;
				}

				if (results == undefined || results.length < 1) {
					res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
					res.write('<h2>사용자 [' + paramWriter.name + ']를 찾을 수 없습니다.</h2>');
					res.end();

					return;
				}
				console.log('사용자 ObjectId : ' + paramWriter.name +' -> ' + paramWriter._id);

				// save()로 저장
				// PostModel 인스턴스 생성
				var post = new database.PostModel({
					title: paramTitle,
					contents: paramContents,
					writer: paramWriter._id
				});

				post.savePost( (err, result) => {
					if (err) {
						if (err) {
							console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

							res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
							res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
							res.write('<p>' + err.stack + '</p>');
							res.end();

							return;
						}
					}

					console.log("글 데이터 추가함.");
					console.log('글 작성', '포스팅 글을 생성했습니다. : ' + post._id);

					return res.redirect('/process/showpost/' + post._id); 
				});

			});

		} else {
			res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
			res.write('<h2>데이터베이스 연결 실패</h2>');
			res.end();
		}
	});
	
	router.get('/listpost', (req, res) => {
		console.log("/listpost 요청 패스됨.");
		
		var database = req.app.get('database');
		
		database.PostModel.find( (err, results) => {
			console.log(results);
        	if(err) {
				return res.status(500).send({error: 'database failure'});
			}
			else if (!req.user) {
				console.log('사용자 인증 안된 상태임.');
				res.render('listpost.ejs', {login_success:false, posts:results});
			}
			else {
				console.log('사용자 인증된 상태임.');
				res.render('listpost.ejs', {login_success:true, user: req.user, posts:results});
			}
    	})
	});
	//검색기능 추가하여 원하는 글 목록만 보여주는 기능 구현할 예정
	router.post('/process/listpost', (req, res) => {
		console.log("/process/listpost 요청 패스됨.");
		
		var database = req.app.get('database');
		
		
	});
	
	router.get('/process/showpost/:id', (req, res) => {
		console.log("/process/showpost 요청 패스됨.");
		// URL 파라미터로 전달됨
		var paramId = req.body.id || req.query.id || req.params.id;

		console.log('요청 파라미터 : ' + paramId);

		// html-entities module is required in showpost.ejs
		var Entities = require('html-entities').AllHtmlEntities;
		
		var database = req.app.get('database');

		// 데이터베이스 객체가 초기화된 경우
		if (database.db) {
			// 1. 글 리스트
			database.PostModel.load(paramId, (err, results) => {
				if (err) {
					console.error('게시판 글 조회 중 에러 발생 : ' + err.stack);

					res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
					res.write('<h2>게시판 글 조회 중 에러 발생</h2>');
					res.write('<p>' + err.stack + '</p>');
					res.end();

					return;
				}

				if (results) {
					console.dir(results);

					// 조회수 업데이트
					console.log('trying to update hits.');

					database.PostModel.incrHits(results._doc._id, function(err2, results2) {
						console.log('incrHits executed.');

						if (err2) {
							console.log('incrHits 실행 중 에러 발생.');
							console.dir(err2);
							return;
						}

					});


					res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});

					// 뷰 템플레이트를 이용하여 렌더링한 후 전송
					var context = {
						title: '글 조회',
						posts: results,
						Entities: Entities
					};

					req.app.render('showpost', context, function(err, html) {
						if (err) {
							console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

							res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
							res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
							res.write('<p>' + err.stack + '</p>');
							res.end();

							return;
						}

						console.log('응답 웹문서 : ' + html);
						res.end(html);
					});

				} else {
					res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
					res.write('<h2>글 조회  실패</h2>');
					res.end();
				}
			});
		}
		else {
			res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
			res.write('<h2>데이터베이스 연결 실패</h2>');
			res.end();
		}
	})
	
	router.delete('/process/delete', (req, res) => {
		console.log("/process/delete 요청 패스됨.");
		console.log("선택한 게시글에 대한 id 정보 : ", req.body._id);
		var userid = req.body._id;
		
		var database = req.app.get('database');
		
		if (database.db) {
			database.PostModel.deleteOne({ _id : userid }, (err, results) => {
				// 에러 발생 시, 클라이언트로 에러 전송
				if (err) {
					console.error('삭제 중 에러 발생 : ' + err.stack);
					res.status(500);
					throw err;
				}
				// 결과 발생 시, 데이터 전송
				if (results) {
					console.log('삭제... 후 ui 제거', results);
					res.status(200).send({ message : '게시글 삭제 성공' });
				}
			});
		}
	});
	
	
	app.use('/', router);
};