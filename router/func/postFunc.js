var path = require('path')
	,utils = require('../../utils/utils');

// 이미지처리용 multer setting
var multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
	cb(null, './public/users/upload') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function (req, file, cb) {
	cb(null, file.originalname + ' upload_at : ' + new Date())// cb 콜백함수를 통해 전송된 파일 이름 설정 
  }
});
// multer setting save
var upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		var ext = path.extname(file.originalname);
		ext = ext.toLowerCase();
		console.log(ext);
		if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
			return cb(new Error('Something wrong on the extname.'));
		}
		cb(null, true);
	},
	limits:{
		fileSize: 1024 * 1024
	}
}).single('image');

var showpostFunc = (req, res) => {
	// URL 파라미터로 전달됨
	var paramId = req.body.id || req.query.id || req.params.id;

	console.log('요청 파라미터 : ' + paramId);

	// html-entities module is required in showpost.ejs
	//var Entities = require('html-entities').AllHtmlEntities;

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


				//res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});

				//------------동기처리 작업------------

				//writer id 값을 name으로 변환하는 동기 함수
				async function writerToName(chdkey, i) {
					await database.UserModel.findById(results._doc.comments[i].writer, (err, writer) => {
						chdkey.writerpopulated[i] = writer.name;
						console.log("해당 writer : ",chdkey.writerpopulated[i]);

						//return writer.name;
					});

				}

				//작성 시간, 작성자 값 재설정
				async function chkey() {

					var chdkey = {
						timetostring: [],
						writerpopulated: []
					}

					for (var i = 0; i < results._doc.comments.length; i++) {

						var stringcmt = results._doc.comments[i].created_at.toString();
						//console.log("bf change -> ", stringcmt);

						chdkey.timetostring[i] = stringcmt.split('GMT')[0];
						//console.log("af change -> ", timetostring[i]);
						console.log("이름으로 변환할 writer id : ", results._doc.comments[i].writer);

						await writerToName(chdkey, i);

					}
					return chdkey;
				}

				async function changevalues() {

					var chdkey = await chkey();

					// 동기 과정을 통해 변환된 값들을 뷰 템플레이트를 통해 렌더링 후 전송
					var context = {
						posts: results,
						writer: chdkey.writerpopulated,
						created: chdkey.timetostring,
						//Entities: Entities,
						arritem: ['nav-item', 'nav-item', 'nav-item active'],
						login_success: true,
						user: req.user,
						message: req.flash()
					};

					function cb(err, html) {
						console.log('post info :', results);
						if (err) {
							console.log('in showpost context : ', context);
							console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

							res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
							res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
							res.write('<p>' + err.stack + '</p>');
							res.end();

							return;
						}
						console.log("댓글 작성자 배열 : ", context.writer);
						res.send(html);
					}

					if (!req.user) {
						console.log('사용자 인증 안된 상태임.');
						context.login_success = false;
						res.render('showpost.ejs', context, cb);
					} else {
						console.log('사용자 인증된 상태임.');
						res.render('showpost.ejs', context, cb);
					}
				}

				changevalues();


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
}

exports.addPost = (req, res) => {
	console.log("addPost in postFunc 요청됨.");

	req.flash('loginRequired', '로그인 후 이용할 수 있는 기능입니다.');
	if (!req.user) {
		console.log('사용자 인증 안된 상태임.');
		res.render('addpost.ejs', {login_success:false, message: req.flash('loginRequired'), arritem: utils.navactive(req.path)});
	} else {
		console.log('사용자 인증된 상태임.');
		res.render('addpost.ejs', {login_success:true, user: req.user, message: req.flash(), arritem: utils.navactive(req.path)});
	}
}

exports.processAddpost = (req, res) => {
	console.log('processAddpost in postFunc 요청됨.');

	//multer errhandling
	upload(req, res, (err) => {
		if (err) {
			console.error('in multer err : ', err.stack);

			res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
			res.write('<h2>POST 생성 중 에러 발생</h2>');
			res.write('<p>' + err.stack + '</p>');
			res.end();

			return;
		}
		console.log(req.body);
		var paramTitle = req.body.title
			,paramContents = req.body.contents
			,paramImageUrl = '';

		if(req.file)
			paramImageUrl = req.file.path;

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
					imageUrl: paramImageUrl,
					writer: paramWriter._id
				});

				post.savePost( (err, result) => {
					if (err) {
						console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

						res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
						res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
						res.write('<p>' + err.stack + '</p>');
						res.end();

						return;
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


}

exports.listpostFunc = (req, res) => {
	console.log("listpostFunc in postFunc 요청됨.");

	var database = req.app.get('database');

	database.PostModel.find( (err, results) => {
		console.log(results);

		var context = {
			login_success:false,
			posts:results,
			arritem: utils.navactive(req.path),
			searchval: false,
			option: false,
			user: req.user
		};

		if (err) {
			console.log('in listpost');
			console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);
			res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
			res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
			res.write('<p>' + err.stack + '</p>');
			res.end();

			return;
		}
		else if (!req.user) {
			console.log('사용자 인증 안된 상태임.');
			res.render('listpost.ejs', context);
		}
		else {
			console.log('사용자 인증된 상태임.');
			context.user = req.user;
			context.login_success = true;
			res.render('listpost.ejs', context);
		}
	})
}

exports.processSearch = (req, res) => {
	console.log("processSearch in postFunc 요청됨.");
	
	console.log('search keyword ::: ', req.query.value, '| ops ::: ', req.query.ops);

	var value = req.query.value
		, ops = req.query.ops
		, refinedarr = [];

	var database = req.app.get('database');

	database.PostModel.find( (err, results) => {
		if(err) {
			return res.status(500).send({error: 'database failure'});
		}
		console.log(results);

		function searchprocess() {
			switch (ops) {
				case '제목':
					console.log("제목으로 검색함.");
					for(var i = 0; i < results.length; i++) {
						if(results[i].title.match(value)) {
							refinedarr.push(results[i]._doc);
						}
					}
					break;
				case '내용' :
					console.log("내용으로 검색함.");
					for(var i = 0; i < results.length; i++) {
						if(results[i].contents.match(value))
							refinedarr.push(results[i]);
					}
					break;
				case 'writer':
					console.log("작성자로 검색함.");
					for(var i = 0; i < results.length; i++) {
						if(results[i].writer == value)
							refinedarr.push(results[i]);
					}
					value = req.user.name;
					break;
				default:
					break;
			}

			console.log('정제된 글 배열 :::');
			console.log(refinedarr);
		}

		searchprocess();

		var context = {
			login_success: false,
			posts: refinedarr,
			arritem: utils.navactive(req.path),
			searchval: value,
			option: ops
		};

		if (!req.user) {
			console.log('사용자 인증 안된 상태임.');
			res.render('listpost.ejs', context);
		}
		else {
			console.log('사용자 인증된 상태임.');
			context.user = req.user;
			context.login_success = true;
			res.render('listpost.ejs', context);
		}

	})

}

exports.processAddComment = (req, res) => {
	console.log("processAddComment in postFunc 요청됨.");

	var paramId = req.body.id;
	var paramContents = req.body.contents;
	var paramWriter = req.body.writer;

	console.log('요청 파라미터 : ' + paramId + ', ' + paramContents + ', ' + paramWriter);

	var database = req.app.get('database');

	// 데이터베이스 객체가 초기화된 경우
	if (database.db) {

		// 1. 아이디를 이용해 사용자 검색
		database.PostModel.findByIdAndUpdate(paramId,
			{'$push': {'comments':{'contents':paramContents, 'writer':paramWriter}}},
			{'new':true, 'upsert':true},
			(err, results) => {
				if (err) {
					console.error('게시판 댓글 추가 중 에러 발생 : ' + err.stack);

					res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
					res.write('<h2>게시판 댓글 추가 중 에러 발생</h2>');
					res.write('<p>' + err.stack + '</p>');
					res.end();

					return;
				}

				console.log("댓글 데이터 추가함.");
				console.log('댓글 작성 성공, 글 ID : ' + paramId);

				//------------동기처리 작업------------

				//writer id 값을 name으로 변환하는 동기 함수
				async function writerToName(chdkey, i) {
					await database.UserModel.findById(results._doc.comments[i].writer, (err, writer) => {
						chdkey.writerpopulated[i] = writer.name;
						console.log("해당 writer : ",chdkey.writerpopulated[i]);

						//return writer.name;
					});

				}

				//작성 시간, 작성자 값 재설정
				async function chkey() {

					var chdkey = {
						timetostring: [],
						writerpopulated: []
					}

					for (var i = 0; i < results._doc.comments.length; i++) {

						var stringcmt = results._doc.comments[i].created_at.toString();
						//console.log("bf change -> ", stringcmt);

						chdkey.timetostring[i] = stringcmt.split('GMT')[0];
						//console.log("af change -> ", timetostring[i]);
						console.log("이름으로 변환할 writer id : ", results._doc.comments[i].writer);

						await writerToName(chdkey, i);

					}
					return chdkey;
				}

				async function changevalues() {

					var chdkey = await chkey();

					// 동기 과정을 통해 변환된 값들을 뷰 템플레이트를 통해 렌더링 후 전송
					var context = {
						posts: results,
						writer: chdkey.writerpopulated,
						created: chdkey.timetostring,
						login_success: true,
						user: req.user,
						message: req.flash()
					};

					function cb(err, html) {
						console.log('post info :', results);
						if (err) {
							console.log('in addcomment context : ', context);
							console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

							res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
							res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
							res.write('<p>' + err.stack + '</p>');
							res.end();

							return;
						}
						console.log("댓글 작성자 배열 : ", context.writer);
						res.send(html);
					}

					if (!req.user) {
						console.log('사용자 인증 안된 상태임.');
						context.login_success = false;
						res.render('comment.ejs', context, cb);
					} else {
						console.log('사용자 인증된 상태임.');
						res.render('comment.ejs', context, cb);
					}
				}

				changevalues();
		});

	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
}

exports.editPost = (req, res) => {
	console.log("editPost in postFunc 요청됨.");

	var postId = req.body.id || req.query.id || req.params.id
		, title = req.body.title
		, contents = req.body.contents
		, imageUrl = req.body.imageUrl;

	console.log("선택한 게시글에 대한 정보 : " + postId + ', ' + title + ', ' + contents + ', ' + imageUrl);
	var context = {
		login_success:true,
		user: req.user,
		message: req.flash(),
		arritem: utils.navactive(req.path),
		title: title,
		contents: contents,
		imageUrl: imageUrl,
		postId: postId
	};

	if (!req.user) {
		console.log('사용자 인증 안된 상태임.');
		res.render('editpost.ejs', {login_success:false, message: req.flash('loginRequired'), arritem: utils.navactive(req.path)});
	} else {
		console.log('사용자 인증된 상태임.');
		res.render('editpost.ejs', context);
	}
}

exports.processEditPost = (req, res) => {
	console.log("processEditPost in postFunc 요청됨.");
	upload(req, res, (err) => {
		if (err) {
			console.error('in multer err : ', err.stack);

			res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
			res.write('<h2>POST 생성 중 에러 발생</h2>');
			res.write('<p>' + err.stack + '</p>');
			res.end();

			return;
		}
		console.log("선택한 게시글에 대한 id 정보 : ", req.body);
		var postId = req.body.id
			, title = req.body.title
			, contents = req.body.contents
			, imageUrl = '';

		if(req.file)
			imageUrl = req.file.path;

		console.log('요청 파라미터 : ' + postId + ', ' + title + ', ' + contents + ', ' + imageUrl);

		var database = req.app.get('database');

		if (database.db) {
			database.PostModel.findOneAndUpdate({_id : postId},
				{$set:{title: title, contents: contents, imageUrl: imageUrl, updated_at: new Date()}}, (err, results) => {
				if (err) {
					console.error('수정 중 에러 발생 : ' + err.stack);
					res.status(500);
					throw err;
				}

				if (results) {
					console.log('수정... 후 reload', results);
					res.status(200);
					res.redirect('/process/showpost/' + postId);
				}
			})
		}
	});

}

exports.processDeletePost = (req, res) => {
	console.log("processDeletePost in postFunc 요청됨.");
	console.log("선택한 게시글에 대한 id 정보 : ", req.body._id);
	var postid = req.body._id;

	var database = req.app.get('database');

	if (database.db) {
		database.PostModel.deleteOne({ _id : postid }, (err, results) => {
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
}

exports.processRemoveComment = (req, res) => {
	console.log("processRemoveComment in postFunc 요청됨.");
	console.log("선택한 댓글에 대한 id 정보 : ", req.body._id);
	var postid = req.body._id
		, commentid = req.body.commentid;

	var database = req.app.get('database');

	if (database.db) {
		
		// var post = new database.PostModel({
		// 	postid,
		// 	commentid
		// });
		
		// post.removeComment( (err, results) => {
		// 	// 에러 발생 시, 클라이언트로 에러 전송
		// 	if (err) {
		// 		console.error('삭제 중 에러 발생 : ' + err.stack);
		// 		res.status(500);
		// 		throw err;
		// 	}
		// 	// 결과 발생 시, 데이터 전송
		// 	if (results) {
		// 		console.log('삭제... 후 ui 제거', results);
		// 		res.status(200).send({ message : '게시글 삭제 성공' });
		// 	}
		// });
		
		database.PostModel.update({ _id: postid }, {$pull: {comments: {_id: commentid}}}, (err, results) => {
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
}

exports.modifyComment = (req, res) => {
	console.log("modifyComment in postFunc 요청됨.");
	var commentContents = req.body.contents
		, location = req.body.location;

	console.log("선택한 Comment에 대한 정보 : " + commentContents + " " + location);

	res.render('modifyComment.ejs', {commentContents, location});
}

exports.processModifyComment = (req, res) => {
	console.log("processModifyComment in postFunc 요청됨.");
	var postId = req.body._id
		, commentId = req.body.commentid
		, commentContents = req.body.contents
		, commentCreated = req.body.created
		, commentWriter = req.body.writer;

	var newComments = [];


	console.log("제출한 Comment에 대한 정보 : " + postId + ', ' + commentId + ', ' + commentContents + ', ' + commentCreated + ', ' + commentWriter);

	var database = req.app.get('database');

	if (database.db) {
		function cb(newComments) {
			console.log('수정된 댓글 배열 ::: ', newComments);
			database.PostModel.updateOne({ _id: postId }, {$set: {comments: newComments}}, (err, results) => {
				if (err) {
					console.error('수정 중 에러 발생 : ' + err.stack);
					res.status(500);
					throw err;
				}

				if (results) {
					console.log('수정... 후 reload', results);
					res.status(200);
					//res.redirect('/process/showpost/' + postId);
					res.send(commentContents);
				}
			})
		}


		async function newCommentArray() {
			await database.PostModel.find({ _id: postId }, (err, results) => {
				// 에러 발생 시, 클라이언트로 에러 전송
				if (err) {
					console.error('수정 중 에러 발생 : ' + err.stack);
					res.status(500);
					throw err;
				}
				// 결과 발생 시, 데이터 전송
				if (results) {
					console.log('find 후 reload', results);

					results[0].comments.forEach( (comments) => {
						console.log(comments);

						if(comments._id == commentId) {
							console.log('gotit');
							var commentTmp = comments;
							commentTmp.contents = commentContents;
							newComments.push( commentTmp );
						}
						else {
							newComments.push( comments );
						}
					});
				}
			});

			return newComments;
		}
		async function modifyCommentProcess() {
			var newComments = await newCommentArray();
			cb(newComments);
		}

		modifyCommentProcess();
	}
}

module.exports.showpostFunc = showpostFunc;