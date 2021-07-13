//캔버스 관련 자바스크립트코드는 옮김
var img_L = 0;
var img_T = 0;
var i=0;//id를 부여하기 위한 변수, 다른 위젯버튼이라도 일괄적인 적용(위젯의 총 개수를 쉽게 알 수 있음)
var j=0;
var k=0;
var targetObj;
var ButtonId;
var wholeDocument;
var selectedBefore={};

var monitor2=document.getElementById("monitor2");

function create2DArray(rows, columns) {
	var arr = new Array(rows);
	for (var i = 0; i < rows; i++) {
		arr[i] = new Array(columns);
	}
	return arr;
}

function getLeft(o){
	return parseInt(o.style.left.replace('px', ''));
}
function getTop(o){
	return parseInt(o.style.top.replace('px', ''));
}

// 이미지 움직이기
function moveDrag(e){
	var e_obj = window.event? window.event : e;
	var dmvx = parseInt(e_obj.clientX + img_L);
	var dmvy = parseInt(e_obj.clientY + img_T);
	targetObj.style.left = dmvx +"px";
	targetObj.style.top = dmvy +"px";
	return false;
}

// 드래그 시작
function startDrag(e, obj){
	targetObj = obj;
	var e_obj = window.event? window.event : e;
	img_L = getLeft(obj) - e_obj.clientX;
	img_T = getTop(obj) - e_obj.clientY;

	document.onmousemove = moveDrag;
	document.onmouseup = stopDrag;
	if(e_obj.preventDefault)e_obj.preventDefault();
}

// 드래그 멈추기
function stopDrag(){
	document.onmousemove = null;
	document.onmouseup = null;
	var id='Detail'+ButtonId;
		var widgetInList=document.getElementById(id);
		widgetInList.style.color='black';
}

function removeElement(){//사실 안정성을 위해 이렇게 ButtonId를 쓰면 안됨. 나중에 수정해야함
	var widgetbox=document.getElementById("widgetbox");
	var elementForRemove=document.getElementById(ButtonId);
	widgetbox.removeChild(elementForRemove);
	if(elementForRemove.innerText=='게시판'|elementForRemove.innerText=='알림'){
		var list = document.getElementById("listForDetail");
		var detailId='Detail'+ButtonId;
		var detailButton=document.getElementById(detailId);
		list.removeChild(detailButton);
	}
}

function addWidget(idNumber){

	var widgetbox=document.getElementById("widgetbox");
	// var box2=document.getElementById("box2");
	// var detailWidgetBox=widgetbox;
	// detailWidgetBox.id="detailWidgetBox";
	var idNumberToString=idNumber+"";
	var selectedWidget=document.getElementById(idNumberToString);
	var newButton=document.createElement("button");
	newButton.id='W'+i;
	i++;


	// monitor2.innerHTML="position"+widgetbox.style.position;

	newButton.style.position="absolute";
	newButton.style.left=0;
	newButton.style.top=0;

	newButton.onmousedown=function(event){
		startDrag(event,newButton);
	}

	newButton.onclick=function(){//추후 더블 클릭 등으로 변경할 수 있음
		var showWhatisSelected=document.getElementById("selectedButton");
		var thisButton=newButton.innerText;

		ButtonId=newButton.id;//사이즈를 변환하는 버튼.
		showWhatisSelected.innerHTML=thisButton+"선택됨"+"(id: "+ButtonId+")";
		var id='Detail'+ButtonId;
		var widgetInList=document.getElementById(id);
		widgetInList.style.color='red';

	}

	var newText=document.createTextNode(idNumberToString);
	widgetbox.appendChild(newButton);
	newButton.appendChild(newText);

	if(newButton.innerText=='게시판'||newButton.innerText=='알림'){

		var list = document.getElementById("listForDetail");
		var newDetailButton=document.createElement("button");
		newDetailButton.id='Detail'+newButton.id;
		var string=newButton.innerText+'('+newDetailButton.id+")";
		var newDetailText=document.createTextNode(string);
		j++;
		
			// var window;
		
			// function send(){
			// 	win.document.getElementById("title").value="게시판 수정";
			// }	
		
			// function openwin(callback){
			
			// 	win=open("/process/detail","new page");
			// 	window=win;
			// 	callback();
			
			// }
		newDetailButton.onclick=function(){
			// javascript:window.location='/process/detail';
			win=open("/process/detail","new page");

			win.document.getElementById("title").innerText="게시판 수정";
			//openwin(send);
		}
		
		list.appendChild(newDetailButton);
		newDetailButton.appendChild(newDetailText);

	}
	
	if(newButton.innerText=='이미지 박스'){//미리보기화면 만들어야함

	var newInputTag= document.createElement('form');
	newInputTag.enctype="multipart/form-data";
	newInputTag.action="#"//벡엔드 처리 추후 업로드시 이미지도 일괄 업로드하는 코드 작성
	newInputTag.method="post";
	var newFile= document.createElement('input');
	var te=document.createTextNode("이미지박스");
	newFile.type="file";

	var sen=newFile.id;
	var monitor1=document.getElementById("monitor1");
	// monitor1.innerText=newFile.id;

	newButton.appendChild(newInputTag);
	newInputTag.appendChild(newFile);

	newFile.onchange = function(e) {
		var fileReader = new FileReader();
		fileReader.readAsDataURL(e.target.files[0]);
		fileReader.onload = function(e) { 
			//document.getElementById('thumnail').src = e.target.result;
			var imgtag=document.createElement('img');
			imgtag.style.width='200px';
			imgtag.id="imgtag"+i;
			newButton.appendChild(imgtag);

			document.getElementById(imgtag.id).src = e.target.result;
			}
	}
	}
}
//묶음 상자는 여러 위젯들을 일렬로 정렬하도록 지원하는 도구. 이 안에 다른 위젯을 배치할 것임

function setSizeOfWidget(){
	var newWidth=document.getElementById("newWidth").value;//추후 현재 크기를 미리 넣을 것
	var newHeigth=document.getElementById("newHeight").value;
	var resizeButton=document.getElementById(ButtonId);

	resizeButton.style.width=newWidth+"px";//단위는 변경 가능 안붙여도 됨
	resizeButton.style.height=newHeigth+"px";
}
function setContentWidget(){
	var newcontent=document.getElementById("newcontent").value;//추후 현재 크기를 미리 넣을 것
	var resetContentButton=document.getElementById(ButtonId);
	resetContentButton.innerText=newcontent;
}


//배경색을 지정하는 RGB 버튼

function rgb_func(){
	var widgetid = ButtonId;
	console.log(ButtonId);
	return widgetid;
}

var $rgb_input = $('#BgColor');

$rgb_input.bind(
	"input",
	() => {
		var widgetid = '#' + rgb_func();
		$(widgetid).css('background', $('#BgColor')[0].value);
	}
)

function saveLayout() {
	let layout = $("#widgetbox")[0].innerHTML;
	alert(layout);
	$.ajax({
		method: "POST",
		url: "/process/addLayout",
		data: {layout: layout}
	}).done( (results) => {
		console.log('layout added');
		alert('저장되었습니다.');
	}).fail( (xhr, textStatus, errThrown) => {
		console.log("서버에서 보내온 오류 정보 : ", xhr, textStatus, errThrown);
	});
}