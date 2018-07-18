const http = require('http');
const apiUrl = 'localhost';

const options = {
    host: apiUrl,
    port: 8000,
    path: '/role',
    method: 'GET'
};

http.request(options, function (res) {
    let body = '';

    res.on('data', function (chunk) {
        body += chunk;
    });

    res.on('end', function(){
        let result = JSON.parse(body);
        console.log(result);
    });
}).end();