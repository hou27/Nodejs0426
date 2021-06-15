//댓글 입력 후에 enter버튼 활성화
$("#comment").on("keyup", () => {
	var flag = true;
	flag = $("#comment").val().length > 0 ? false : true;
	$("#addbtn").attr("disabled", flag);
});


function addComment() {
	if($("#comment").val().length > 0) {
		var formData = $('#addcomment').serializeArray(); // serialize 사용 -- 객체 형식으로
		$.ajax({
			method: "POST",
			url: "/process/addcomment",
			data: {id: formData[2].value, contents: formData[0].value, writer: formData[1].value}
		}).done( (results) => {
			console.log('call view');
			// Contents 영역 제거
			$('.comments').children().remove();
			// Contents 영역 교체
			$('.comments').html(results);
		}).fail( (xhr, textStatus, errThrown) => {
			console.log("서버에서 보내온 오류 정보 : ", xhr, textStatus, errThrown);
		});
	}
}

$('#edit').click( (e) => {
	var postNum = e.target.dataset.id;
	var imageUrl = '';
	if(document.querySelector("#imageUrl")) {
		imageUrl = document.querySelector("#imageUrl").src;
		console.log(imageUrl);
	}

	$.ajax({
		method : 'POST',
		url : '/edit/' + postNum,
		data : { title: $('#title')[0].innerText
				, contents: $('#contents')[0].innerText
				, imageUrl: imageUrl
			   }
	}).done( (results) => {
		console.log('call view');
		// Contents 영역 제거
		$('#showpostid').children().remove();
		// Contents 영역 교체
		$('#showpostid').html(results);
		console.log(results);
	}).fail( (xhr, textStatus, errThrown) => {
		console.log("서버에서 보내온 오류 정보 : ", xhr, textStatus, errThrown);
	});
})

$('#delete').click( (e) => {
	if(confirm('정말 게시물을 삭제하시겠습니까?')) {
		var postNum = e.target.dataset.id;
		$.ajax({
			method : 'DELETE',
			url : '/process/delete',
			data : { _id : postNum }
		}).done( (results) => {
			location.href = '/listpost';
		}).fail( (xhr, textStatus, errThrown) => {
			console.log("서버에서 보내온 오류 정보 : ", xhr, textStatus, errThrown);
		});
	}
})


// 댓글 삭제 기능
$('.deleteComment').click( (e) => {
	if(confirm('정말 댓글을 삭제하시겠습니까?')) {
		var commentid = e.target.dataset.id
			, postid = $('#hiddenPostId')[0].value;
		$.ajax({
			method : 'POST',
			url : '/process/removeComment',
			data : { _id: postid, commentid : commentid }
		}).done( (results) => {
			console.log('remove comment');
			var deleteUI = '#' + commentid
				,decCnt = $('#commentCnt')[0].innerText;
			console.log('ui fadeout exec');
			$(deleteUI).fadeOut();
			$('#commentCnt')[0].innerText = parseInt(decCnt) - 1;
		}).fail( (xhr, textStatus, errThrown) => {
			console.log("서버에서 보내온 오류 정보 : ", xhr, textStatus, errThrown);
		});
	}
})

// 댓글 수정 기능
$('.editComment').click( (e) => {
	console.log(e.target.dataset.id);
	var i = e.target.dataset.id
		, contents = $('.commentContents.contents')[i].innerText;
	$.ajax({
		method : 'POST',
		url : '/modifyComment',
		data : { contents }
	}).done( (results) => {
		console.log('modify comment');
		//$(".commentContents.contents")[1].innerText
		// Comment 영역 교체
		$('.commentContents.contents')[i].innerHTML = results;
	}).fail( (xhr, textStatus, errThrown) => {
		console.log("서버에서 보내온 오류 정보 : ", xhr, textStatus, errThrown);
	});
})

// 댓글 수정 기능 (submit)
$('#modifyCommentBtn').click( (e) => {
	console.log(e.target.dataset.id);
	var i = e.target.dataset.id
		, _id = $('#hiddenPostId')[0].value
		, commentid = $('.comment')[i].id
		, contents = $('.commentContents.modifingcontents')[i].innerText
		, created = $('.commentContents.created')[i].innerText
		, writer = $('.commentContents.writer')[i].innerText;
	$.ajax({
		method : 'POST',
		url : '/process/modifyComment',
		data : { _id, commentid, contents, created, writer }
	}).done( (results) => {
		console.log('modify comment submit');
		// Comment 영역 교체
		$('.commentContents.contents')[i].innerText = results;
	}).fail( (xhr, textStatus, errThrown) => {
		console.log("서버에서 보내온 오류 정보 : ", xhr, textStatus, errThrown);
	});
})


