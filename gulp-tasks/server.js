/**
 * A testing web-server for LiveStyle web-site
 */
'use strict';
import connect from 'connect';
import serveStatic from 'serve-static';

export default function(docroot, port=8080) {
	var app = connect()
	.use((req, res, next) => {
		req.url = req.url.replace(/^\/\-\/\w+/, '');
		next();
	})
	.use(serveStatic(docroot));
	app.listen(port);
	console.log(`Started web-server at http://localhost:${port}`);
	return app;
};