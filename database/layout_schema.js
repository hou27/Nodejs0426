/**
 * layout을 위한 데이터베이스 스키마를 정의하는 모듈
 *
 * @date 2021-07-11
 */

var LayoutSchema = {};

LayoutSchema.createSchema = (mongoose) => {
	// 댓글 스키마 정의
	var LayoutSchema = mongoose.Schema({
	    userId: {type: mongoose.Schema.ObjectId, ref: 'users1'},
		layout: {type: String, trim:true, 'default': ''},
			// layout: [{	// 요소
			// positionLeft: {type: String, required: true, trim:true, 'default': ''},
			// positionTop: {type: String, required: true, trim:true, 'default': ''},
			// style: {type: String, trim:true, 'default': ''}		// 배열로 하려했으나 굳이 배열일 필요가 없을 듯하여 수정
			// }],
	    created_at: {type: Date, index: {unique: false}, 'default': Date.now},
	    updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
	});
	
	
	LayoutSchema.methods = {
		saveLayout: function(callback) {		// 레이아웃 저장
			var self = this;
			this.validate( (err) => {
				if (err) return callback(err);
				
				self.save(callback);
			});
		}
	}
	
	console.log('LayoutSchema 정의함.');

	return LayoutSchema;
};

// module.exports에 LayoutSchema 객체 직접 할당
module.exports = LayoutSchema;