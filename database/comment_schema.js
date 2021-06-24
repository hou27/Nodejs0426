/**
 * 댓글을 위한 데이터베이스 스키마를 정의하는 모듈
 *
 * @date 2021-06-21
 * @author hou27
 */

var utils = require('../utils/utils');

var CommentSchemaObj = {};

CommentSchemaObj.createSchema = (mongoose) => {
	// 댓글 스키마 정의
	var CommentSchema = mongoose.Schema({
	    postId: {type: mongoose.Schema.ObjectId, ref: 'posts'},
	    contents: {type: String, trim: true, 'default':''},
	    writer: {type: String, trim:true, 'default': ''},
		writerName: {type: String, trim:true, 'default': ''},
	    nestedComments: [{	// 댓글
	    	contents: {type: String, trim:true, 'default': ''},
	    	writer: {type: String, trim:true, 'default': ''},
			writerName: {type: String, trim:true, 'default': ''},
	    	created_at: {type: Date, 'default': Date.now}
	    }],
	    created_at: {type: Date, index: {unique: false}, 'default': Date.now},
	    updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
	});
	
	// 필수 속성에 대한 'required' validation
	CommentSchema.path('contents').required(true, '댓글 내용을 입력하셔야 합니다.');
	
	CommentSchema.methods = {
		saveComment: function(callback) {		// 댓글 저장
			var self = this;
			this.validate( (err) => {
				if (err) return callback(err);
				
				self.save(callback);
			});
		}
	}
	
	console.log('CommentSchema 정의함.');

	return CommentSchema;
};

// module.exports에 CommentSchema 객체 직접 할당
module.exports = CommentSchemaObj;