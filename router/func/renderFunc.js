exports.addLayout = (req, res) => {
	console.log("addLayout in renderFunc 요청됨.");
	
	if(req.isAuthenticated()){
		res.render('secondeditor.ejs', {message: req.flash('loginMessage')});
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
	
	let layout = req.body.layout;
	// if(req.body.content.style) {	// style은 한줄의 문자열로 가공하여 한방에 추가한다고 가정함.
	// 	layout.style = req.body.content.style;
	// }

	var database = req.app.get('database');

	// 데이터베이스 객체가 초기화된 경우
	if (database.db) {

		var layoutContents = new database.LayoutModel({
			userId,	// 유저와 연결해야하므로 필요
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
				//res.send("<script>alert('저장되었습니다.');</script>");
			});
		});

	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
}