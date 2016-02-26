# hapi-pre-test
Testing how prerequisites work in Hapi 13

tl;dr: prerequisites are the greatest. 

When using config { pre: [...], handler: function(request, reply) {...} } style you can avoid getting lost in callbacks by doing everything in pre block and then just decide what to show in handler function. I was somewhat unsure about the awesomeness of the pre [[...]] thing so I decided to investigate. 

## Running
* npm install
* npm start

## [http://localhost:3000/sequential](http://localhost:3000/sequential)
putting everything in an array makes the code run sequential and the result of previous calls can be used with the  request.pre object.

```javascript
server.route({
    method: ...
    path: ...
    config: {
        pre: [
            { method: slow, assign: 'slow' },
            { method: fast, assign: 'fast' }
        ],
        handler: ...
    }
});
```


## [http://localhost:3000/parallel](http://localhost:3000/parallel) 
If you have multiple calls and they can be run simultaneously then this is the way to go.

```javascript
server.route({
    method: ...
    path: ...
    config: {
        pre: [
            [
                { method: slow, assign: 'slow' },
                { method: fast, assign: 'fast' }
            ]
        ],
        handler: ...
    }
});
```

## [http://localhost:3000/both](http://localhost:3000/both)
A nice thing is that these can be combined. One could load some data first and then do bunch of stuff with it later. Not that you should. Your code should be clean. Always.

```javascript
server.route({
    method: ...
    path: ...
    config: {
        pre: [
            [
                { method: slow, assign: 'slow' },
                { method: fast, assign: 'fast' }
            ],
            { method: fast, assign: 'fastt' }
        ],
        handler: ...
    }
});
```
