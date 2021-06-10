var socket = io('/chat');
socket.emit('req', 'public');
socket.on('broadcast', (data) => {
	$('.list-group.chatPage').append('<li class="list-group-item">' + data + '</li>');
	$('.list-group.chatPage').scrollTop($('.list-group.chatPage').prop('scrollHeight'));
	$('#sendmsg')[0].value = '';
})

$('#joinpub').click( () => {
	//socket.io 라이브러리 사용
	socket.emit('req', 'public'); //namespace 사용	
})

$('#join1').click( () => {

	socket.emit('req', 'room_1');
})
$('#join2').click( () => {
	var pw = prompt('비밀번호를 입력해주세요.');
	console.log(pw)
	socket.emit('req', {roomnum: 'room_2', pw: pw});
})
//data 전송 함수
function send() {
	console.log('send() has been active');
	if($("#sendmsg").val().length > 0) {
		var sendmsg = $("#sendmsg").val();
		socket.emit('sendmsg', sendmsg);
	}
}

//chating box 켜고 끄기
$(".float").click( () => {
	if($(".chatbox")[0].style.display == 'none'){
		$(".chatbox")[0].style.display = 'block';
	}else{
		$(".chatbox")[0].style.display = 'none';
	}
})