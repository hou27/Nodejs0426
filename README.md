# Nodejs0426
test repo for ap-page

  

--07.13  
```
render.js
renderFunc.js
layout_schema.js
user_schema.js
app.js
config.js
```
위 파일들 생성/수정하여 ap-page project의 기능 테스트함.

* 각 layout에 layoutName을 지정하여 db에 저장해야함.  
* 사용자 별로 layout을 열람, 관리할 수 있는 페이지 및 기능이 필요함.  

--07.13(연등)  
* editor.js의 addWidget()을 수정하여 addEvents()로 세분화, 저장된 layout을 불러온 후에도 수정이 가능하도록 함.  
* profile.ejs에서 내 layout 목록을 확인할 수 있도록 하였으며, 해당 layout으로 이동할 수 있도록 함.  
* 기본적으로 layout 제작 후 저장과정은 모두 구현을 마쳤지만, 해당 layout을 불러옴에 있어서 문제가 발생함. 내일 해결해볼 예정.  

```
db.users1.update({'_id':ObjectId("60a88a762bb913020bd8c96f")},{$pull:{customedLayout:{_id:ObjectId("60eeb0f751e31104092a635c")}}})
```

--07.14  
* layout 불러오기 구현 완료.  
* layout 수정 기능 구현 완료.  
* layout 수정 or 저장 시 title 미입력 감지되면 post요청 막도록 함.  

--07.16  
* layout save func 오류 수정 완료.  

//수정작업 시 게시판 등의 페이지로 넘어가는 작업이 현재 불가. 수정해야함.  