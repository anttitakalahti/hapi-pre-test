'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 3000 });

const wait = function(callback) { setTimeout(callback, 1000); };

const slow = function(request, reply) {

	wait(function() {
		console.log('I am slow function and request.pre.fast is', request.pre.fast);
		reply(true);
	});
};

const fast = function(request, reply) {
	console.log('I am fast function and request.pre.slow is', request.pre.slow);
	reply(true);
};

server.route({
	method: 'GET',
	path: '/sequential',
	config: {
		pre: [ 
			{ method: slow, assign: 'slow' },
			{ method: fast, assign: 'fast' } 
		],
		handler: function (request, reply) {
			// I am slow function and request.pre.fast is undefined
			// I am fast function and request.pre.slow is true
		        reply('Hello, world!');
		}
	}
});

server.route({
	method: 'GET',
	path: '/parallel',
	config: {
		pre: [ 
			[
				{ method: slow, assign: 'slow' },
				{ method: fast, assign: 'fast' } 
			]
		],
		handler: function (request, reply) {
			// I am fast function and request.pre.slow is undefined
			// I am slow function and request.pre.fast is true
		        reply('Hello, world!');
		}
	}
});

server.start(function(error) {
	if (error) { throw error; }
	console.log('Server running at:', server.info.uri);
});
