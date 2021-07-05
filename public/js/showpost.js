//댓글 입력 후에 enter버튼 활성화
$("#comment").on("keyup", () => {
	var flag = true;
	flag = $("#comment").val().length > 0 ? false : true;
	$("#addbtn").attr("disabled", flag);
});

$("#nestedComment").on("keyup", () => {
	var flag = true;
	flag = $("#nestedComment").val().length > 0 ? false : true;
	$("#addNCbtn").attr("disabled", flag);
});

function addComment() {
	if($("#comment").val().length > 0) {
		var formData = $('#addcomment').serializeArray(); // serialize 사용 -- 객체 형식으로
		$.ajax({
			method: "POST",
			url: "/process/addcomment",
			data: {postId: formData[3].value, contents: formData[0].value, writer: formData[1].value, writerName: formData[2].value}
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

function addNestedComment() {
	if($("#nestedComment").val().length > 0) {
		var formData = $('#addNestedComment').serializeArray(); // serialize 사용 -- 객체 형식으로
		var postId = $('#hiddenPostId')[0].value;
		$.ajax({
			method: "POST",
			url: "/process/addNestedComment",
			data: {postId, commentPId: formData[3].value, contents: formData[0].value, writer: formData[1].value, writerName: formData[2].value}
		}).done( (results) => {
			console.log('nestedComment added');
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
$(document).on('click', '.deleteComment', (e) => {
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
$(document).on('click', '.editComment', (e) => {
	console.log(e.target.dataset.id);
	var i = e.target.name;
	var commentId = e.target.dataset.id
		, contents = $('.commentContents.contents')[i].innerText;
	$.ajax({
		method : 'POST',
		url : '/modifyComment',
		data : { contents, commentId, location: i }
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
$(document).on('click', '#modifyCommentBtn', (e) => {
	console.log(e.target.dataset.id);
	
	var i = e.target.parentElement.parentElement.children[3].children[1].children[0].name;
	var commentId = e.target.dataset.id
		, postId = $('#hiddenPostId')[0].value
		//, commentid = $('.comment')[i].id
		, contents = $('.commentContents.modifingcontents')[0].value;
		// , created = $('.commentContents.created')[i].innerText
		// , writer = $('.commentContents.writer')[i].innerText;
	$.ajax({
		method : 'POST',
		url : '/process/modifyComment',
		data : { postId, commentId, contents }
	}).done( (results) => {
		console.log('modify comment submit');
		// Comment 영역 교체
		$('.commentContents.contents')[i].innerText = results;
	}).fail( (xhr, textStatus, errThrown) => {
		console.log("서버에서 보내온 오류 정보 : ", xhr, textStatus, errThrown);
	});
})

// 대댓글 추가 기능
$(document).on('click', '.addNestedComment', (e) => {
	console.log(e.target.dataset.id);
	var i = e.target.name;
	var commentId = e.target.dataset.id;
	if($("#addNestedComment")[0]) {
		let preLocation = parseInt($("#addNestedComment")[0].parentElement.dataset.commentLocation);
		if(preLocation == i) {
			return 0;
		}
		else {
			$("#addNestedComment")[0].remove();
		}
	}
	$.ajax({
		method : 'POST',
		url : '/addNestedComment',
		data : { commentId, location: i }
	}).done( (results) => {
		console.log('add nested comment');
		//$(".commentContents.contents")[1].innerText
		// Comment 대댓글 ui 추가
		var $commentTag = $(results);
		$('.comment')[i].append($commentTag[0]);
	}).fail( (xhr, textStatus, errThrown) => {
		console.log("서버에서 보내온 오류 정보 : ", xhr, textStatus, errThrown);
	});
})

// 대댓글 열고닫기 기능
$(document).on('click', '.open_nestedComment', (e) => {
	var location = e.target.parentElement.dataset.id;
	if($(".wrap_nestedComment")[location].style.display == 'none'){
		$(".wrap_nestedComment")[location].style.display = 'block';
	}else{
		$(".wrap_nestedComment")[location].style.display = 'none';
	}
})