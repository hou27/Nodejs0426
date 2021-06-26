//게시물 삭제 버튼 구현
$('.delete').click( (e) => {
	var postNum = e.target.dataset.id;
	$.ajax({
		method : 'DELETE',
		url : '/process/delete',
		data : { _id : postNum }
	}).done( (results) => {
		var deleteUI = '#' + postNum;
		console.log('ui fadeout exec');
		$(deleteUI).fadeOut();
	}).fail( (xhr, textStatus, errThrown) => {
		console.log("서버에서 보내온 오류 정보 : ", xhr, textStatus, errThrown);
	});
})

$('.view').click((e) => {
	var postNum = e.target.dataset.id;
	console.log("move location");
	location.href = '/process/showpost/' + postNum;
});

//검색 옵션 보이기
$('#opsearch').click( () => {
	if($('#opsearch')[0].innerText == '제목') {
		$('#opsearch')[0].innerText = '내용';
	}
	else {
		$('#opsearch')[0].innerText = '제목';
	}
})

function search() {
	if($('#search-input').val() != '') {
		var search_input = $('#search-input').val();
		location.href = '/process/search?value=' + search_input + '&ops=' + $('#opsearch')[0].innerText;
	}
}
/*
window.addEventListener(
	'keypress', () => {
		$('#search-input').focus();
	})
*/

// infinity scroll ex)
// 페이징 기법으로 구현 예정 게시물 6개씩 끊어서 페이징할 예정
var count = 0;
window.onscroll = (e) => {
	//console.log(window.innerHeight , window.scrollY,document.body.offsetHeight)
	if((window.innerHeight + window.scrollY) >= document.body.offsetHeight) { 
		setTimeout(function(){
			$.ajax({
				method : 'GET',
				url : '/listpost'
			}).done( (results) => {
				//console.log(results);
				console.log('load post exec');

			}).fail( (xhr, textStatus, errThrown) => {
				console.log("서버에서 보내온 오류 정보 : ", xhr, textStatus, errThrown);
			});
			var addContent = document.createElement("li");
			addContent.innerText = `${++count}번째 블록`
			$('.list-group.container.mt-4').append(addContent);
		}, 500)  
	}
}