/*
 * 설정 파일
 */

module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [
        {file:'./user_schema', collection:'users1', schemaName:'UserSchema', modelName:'UserModel'}
        ,{file:'./post_schema', collection:'posts', schemaName:'PostSchema', modelName:'PostModel'}
		,{file:'./comment_schema', collection:'comments', schemaName:'CommentSchema', modelName:'CommentModel'}
	],
	route_info: [
		// //{file:'./post', path:'/process/addpost', method:'addpost', type:'post'}
		// {file:'./post', path:'/process/showpost/:id', method:'showpost', type:'get'}
		// //,{file:'./post', path:'/process/listpost', method:'listpost', type:'post'}
		// //,{file:'./post', path:'/listpost', method:'listpost', type:'get'}
		// ,{file:'./post', path:'/process/addcomment', method:'addcomment', type:'post'}
		// ,{file:'./post', path:'/process/editor', method:'editor', type:'get'}
		// ,{file:'./post', path:'/process/detail', method:'detaileditor', type:'get'}
	],
	facebook: {		// passport facebook
		clientID: '1442860336022433',
		clientSecret: '13a40d84eb35f9f071b8f09de10ee734',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {		// passport twitter
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/twitter/callback'
	},
	google: {		// passport google
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/google/callback'
	}
}