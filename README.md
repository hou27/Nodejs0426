# Nodejs0426
Nodejs practice

기본 crud부터 시작하여 결제기능 등 ***추후 프로젝트를 위한 기반 기술들을 구현해볼 프로젝트  


--05.22  
◆ 다중 사용자 기능 완성 및 posting 기능 기반 완성 및 mongodb 오류 해결  

--05.23  
◆ showpost 및 listpost 기능 추가  
◆ Foundation commit  

//추후 navbar action 추가해야함. --done  

--05.25  
◆ navbar action 추가  
◆ showpost rendering 부분 수정 및 오류 해결  

--05.26  
※ 미들웨어가 자꾸 2번 or 3번 호출된다 정신나갈거같애정신나갈거같애정신나갈거같애정신나갈거같애 favicon.ico문제 아님 @$%@#%!#%!@^&$  

//미들웨어 중복 호출 문제 해결해야 함. #조회수가 n배로 찍혀 상당히 곤란함; -- 06.03. 아무것도 건들지 않았는데 갑자기 중복호출되지 않음;;  
//포스트에 조회수 표시해야 함. -done  
//포스트 상세조회 뷰에 댓글기능 추가해야함. -done  
//포스트 검색기능 추가해야함. -done  

--05.26 (연등)  
◆ listpost 게시물페이지로 이동 기능 추가  
◆ 마우스 이벤트 추가  
◆ 댓글 기능 추가  
◆ writer -> name으로 변환 진행중  

--05.27  
◆ writer -> name으로 변환  
◆ 작성자에 적용 #동기처리를 해야만 값이 넘어감. --> 완료(async 괜히 설치함.)  

--05.27 (연등)  
◆ list->show 작업 시 body안에 head 내용 중복되는 문제 발견 -- 해결, 해당 과정 ajax 방식에서 location 이동 방식으로 변경.  

//글 수정 및 댓글 수정 기능 추가해야함. --글 수정은 done  
//이미지 업로드 기능 추가해야함. --done  

--05.28  
◆ 포스트 검색 기능 추가함.

//검색기능에 작성자로도 검색할 수 있도록 기능 추가해야함. -> 제목, 내용 변경하는 버튼 드롭다운으로 대체할까 고려 중. -- profile page에서만 내가 쓴글 조회 가능하도록 ui추가함. 

--05.29  
◆ multer 설치 -> local에서 이미지 처리  

--05.31(연등)  
◆ 검색 input태그에 enter이벤트 추가  
◆ 리스트페이지에서 keypress이벤트 발생 시 검색란 focus 추가  --06.10 기능 삭제
◆ 검색결과 창에서 내용 or 제목 옵션 유지되도록 추가  
◆ /process/addpost의 image 첨부 안했을 경우의 예외처리  
◆ post 상세페이지를 작성자 본인이 들어갔을 경우 삭제 기능 추가  
			

//유저 간 채팅 서비스 추가할 예정  
//post 상세페이지를 작성자 본인이 들어갔을 경우 수정 기능 추가 중.. --done  

--06.01(연등)  
◆ 게시글 수정기능 추가  
◆ 라우터에 multer err 핸들링 추가  
◆ 라우터에 multer fileFilter 예외처리  

--06.03(연등)  
◆ Back 버튼의 onclick event를 history로 수정  
◆ profile 페이지에서 내가 쓴 글 볼 수 있는 버튼 && 기능 추가  
◆ listpost 댓글 수 ui 추가  
◆ back 버튼 댓글 작성 시 referrer가 보안상 하나전까지만 담을 수 있어 list로 못 빠져나감. --> 댓글 다는 방식을 ajax로 변경함. ---> 실패 추후 다시 할 예정

--06.04  
◆ 댓글 다는 방식을 ajax로 변경 성공 form 태그 안에 버튼 타입을 submit으로 유지해서 헤맸음. --> 댓글 문자열이 특수코드로 변환되는 문제 남음. --> form data를 객체형식으로 serialize해서 해결.


--06.06  
◆ chat 기능 개발 시작 -- "socket.io": "^4.1.2" 설치 [cdnjs](https://cdnjs.com/libraries/socket.io)  
◆ 실시간 채팅 기능 초기단계 완료  

//비밀채팅방 + 비밀번호 거는 기능 추가해야함.

--06.08  
◆ chat page를 우측 하단 floating btn을 통한 켜고 끌 수 있는 기능 구현  

// 채팅방 ui 제작 해야함.  
// 채팅 page 화면 resizing하면 ui 겹치는 문제 해결해야함. -- position fixed로 전부 수정하여 일단 해결(chat page가 화면 사이즈마다 resizing되게 할지는 고민)  

--06.10  
◆ chat page css 수정  
◆ 모든 창에서 chating 기능 이용할 수 있도록 함.(chat.js, chat.css, chatpage.ejs, footer.ejs에 관련 내용있음.) ++ listpage에서 자동 focus기능 삭제함.  

// showpost comment ui 뒤틀림 발견 --> flexbox로 해결   --done  

--06.13(연등)  
◆ 빈 값으로 등록된 댓글 아래와 같은 과정으로 db update하여 댓글 제거함.  
```
db.posts.findOne({comments:{"$elemMatch":{contents:''}}})
db.posts.find({title:'fortest'},{comments:{"$elemMatch":{contents:''}}})
db.posts.update({title:'fortest'},{$pull:{comments:{contents:''}}})
```
◆ showpost page 댓글 ui flexbox로 정렬  
◆ comment 삭제 기능 구현 중...  
// 각 ejs의 script들 정리 필요.  
// listpost page infinity scroll 구현 예정 -> [참고](https://code-study.tistory.com/22)  

--06.14(연등)  
◆ comment 삭제 기능 구현 완료  
◆ comment ui 수정  
◆ main home page 사진 비율 조정  

// 가끔 마지막 댓글의 작성자가 뜨지 않는 경우 발견  
// 게시물을 6~7개 정도로 끊어 페이징하여 무한 스크롤을 구현할 예정  


--06.14(연등)  
◆ comment ui 수정  
◆ 댓글 수정 기능 구현 중  
```
db.posts.update({title:'fortest'},{comments:{"$elemMatch":{_id:"60c75fecb9c0cb0e2a0b05e0"}}}, {$set:{comments:{contents:'updatetest'}}})
db.posts.find({title:'fortest'},{comments:{"$elemMatch":{_id:"60c75fecb9c0cb0e2a0b05e0"}}})
db.posts.findOne({_id:ObjectId("60c8b602e9909e033b2f492a"),{comments:{"$elemMatch":{_id:"60a882ca8895d60255a0e3a3"}}}})
```
// $set을 이용하여 배열 내의 댓글 값을 update하려했지만 의도한 결과를 얻지 못함..  

--06.17(연등)   
◆ 댓글 수정 기능 구현 중  
```
db.posts.update({_id:ObjectId("60c8bcea90054303835c6db6")},{comments:{_id:ObjectId("60cb453ee0579101e353d8e5")}},{$set:{comments:{contents:'updatetest'}}}) ::: X

db.posts.find({_id:ObjectId("60cb4821e0579101e353d8e7")}).forEach( (post) => {
	post.comments.forEach( (comments) => {
		if(comments._id == ObjectId("60cb4827e0579101e353d8eb")) {
			comments.contents = 'changeVal';
		}
	});
	db.posts.save(post);
});

database.PostModel.find({ _id: postId }).forEach( (post) => {
	post.comments.forEach( (comments) => {
		if(comments._id == commentId) {
			var aNewItem = { contents: commentContents };
			database.PostModel.update(comments, {$set: aNewItem})
		}
	});
});
db.posts.find({ _id: ObjectId("60cb4821e0579101e353d8e7") }).forEach( (post) => {post.comments.forEach( (comments) => {if(comments._id == ObjectId("60cb4827e0579101e353d8eb")) {var aNewItem = { contents: 'changeVal' };db.posts.update(comments, {$set: aNewItem})}});});
```
◆ ajax로 불러온 Element의 event가 작동하지 않는 오류를 발견하여 아래와 같이 수정함.  
```
$('.deleteComment').click( (e) => {}) ::: before

$(document).on('click', '.deleteComment', (e) => {}) ::: after
```
◆ 댓글 수정 과정에서 수정된 배열을 작성하는 과정이 queue로 넘어가서 빈 배열이 넘어감. 즉, 빈 댓글 배열로 set됨. 동기화 작업 진행해야함..  

--06.18  
◆ 댓글 수정 기능 구현 완료  
◆ postFunc.js에 refactoring  

//21.06.18. 19:51 댓글 수정 후 'add'라고 댓글 추가했더니 댓글 전체가 날아가고 add만 남는 현상 발생. 재발하진 않으며 원인불명임.  
  ㄴ (postId : 60cb4821e0579101e353d8e7)  
  
//게시물 사진 규격 정해야함.  --object-fit으로 done.

--06.20  
◆ 코드 정리.  
◆ 사진 규격 정함.  
◆ chatpage div 정리.  

--06.21  
◆ 대댓글 구현을 위해 스키마 추가 및 대폭적 수정에 들어감.  
  ㄴ 현재 댓글 추가, 삭제 등의 작업은 성공하였으며 수정 및 세부정보 표시 등은 추후 작업할 예정임..  
  (comment.ejs, showpost.js, postFunc.js, post_schema.js, config.js, comment_schema.js)  
  
--06.23  
◆ 댓글 수정 및 세부정보 표시 작업까지 완료함.  
◆ 삭제 시에 comments collection에서도 해당 data 삭제되도록 수정함.  

//~~한번에 하나의 댓글만 수정 ui 띄울 수 있도록 해야함.~~  
 ++ 대댓글 달 수 있는 ui 제작 및 기능 구현해야함.  -- 초기 ver done.
//실시간 채팅 내역 페이지 이동 시에도 유지, 채팅방마다의 내역 보관해야함.  
//db 관계도? 그려보기  

--06.24(연등)  
◆ listpost 최근 순으로 정렬하여 띄우도록 수정함.  
◆ 글 수정 시 댓글 객체 수 에러 수정.  
◆ 대댓글 추가 기능 및 초기 ui 구현 완료.  

```
원인 모를 버그로 대댓글이 하나가 더 들어가서 삭제함.
db.comments.update({'_id':ObjectId("60d3016937c602053211bb42")},{$pull:{nestedComments:{_id:ObjectId("60d49364b30cf515ca602908")}}})
```
//종종 showpostprocess 진행 시 오류가 발생하는데 서버에서 받는 댓글의 값이 undefined로 오류 발생. 근데 다시 새로고침하면 잘 로드됨. 아직 원인 파악 못함.  
//한번에 하나의 댓글만 수정 ui 띄울 수 있도록 해야함.  
//대댓글을 펼치고 접을 수 있도록 해야함.  
//시간 부족으로 대댓글 추가와 동시에 추가된 대댓글을 불러와 띄우는 기능을 마무리하지 못함.    