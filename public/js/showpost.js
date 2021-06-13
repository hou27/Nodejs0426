//댓글 입력 후에 enter버튼 활성화
$("#comment").on("keyup", () => {
	var flag = true;
	flag = $("#comment").val().length > 0 ? false : true;
	$("#addbtn").attr("disabled", flag);
});



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

// 댓글 삭제 기능 구현 중... -06.13
function delComment() {
	if(confirm('정말 댓글을 삭제하시겠습니까?')) {
		var commentid = e.target.dataset.id
			, postid = $('#hiddenPostId')[0].value;
		$.ajax({
			method : 'POST',
			url : '/process/removeComment',
			data : { _id: postid, commentid : commentid }
		}).done( (results) => {
			console.log('remove comment');
		}).fail( (xhr, textStatus, errThrown) => {
			console.log("서버에서 보내온 오류 정보 : ", xhr, textStatus, errThrown);
		});
	}
}

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