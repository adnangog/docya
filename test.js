const http = require('http');

module.exports.api = (path, method, params, cb) => {

    const apiUrl = 'localhost';
    var data = JSON.stringify(params);

    const options = {
        host: apiUrl,
        port: 8000,
        path: path,
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var post_req = http.request(options, function (res) {
        res.setEncoding('utf8');
        let body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            let result = JSON.parse(body);
            cb(result);
        });
    });

    if(method=='POST')
        post_req.write(data);

    post_req.end();
};

const api = require('./api');

api.api("/role", "POST", {
    "name": "STAJYER",
    "authorities": [],
    "rDate": "2018-07-07"
}, function (result) {
    console.log(result);
});

api.api("/role", "GET", null, function (result) {
    console.log(result);
});