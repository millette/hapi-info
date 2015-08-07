// Load modules

var Code = require('code');
var Glue = require('glue');
var Hapi = require('hapi');
var Lab = require('lab');


// Test shortcuts

var lab = exports.lab = Lab.script();
var expect = Code.expect;
var describe = lab.describe;
var it = lab.test;


var internals = {};

internals.prepareServer = function (options, callback) {

    var server = new Hapi.Server();

    var manifest = {
        plugins: [
            { '../': options },
            { './plugins/blah.js': null },
            { './plugins/main.js': null }
        ]
    };

    Glue.compose(manifest, { relativeTo: __dirname }, function (err, server) {

        expect(err).to.not.exist();
        return callback(err, server);
    });
};

describe('routes', function () {

    it('prints plugin and server information', function (done) {

        internals.prepareServer({}, function (err, server) {

            server.inject('/hapi-info', function (res) {


                var result = {
                    server: {
                        node: process.version,
                        hapi: '8.8.1'
                    },
                    plugins: [{
                        name: 'hapi-info',
                        version: require('./../package.json').version
                    },
                    {
                        name: 'blah',
                        version: '1.2.3'
                    },
                    {
                        name: 'main',
                        version: '0.1.1'
                    }]
                };
                expect(res.result).to.deep.equal(result);
                done();
            });
        });
    });

});
