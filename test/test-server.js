const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
// this lets us use *should* style syntax in our tests
// so we can do things like `(1 + 1).should.equal(2);`
// http://chaijs.com/api/bdd/
const should = chai.should();

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('Blog Post', function () {

    before(function () {
        return runServer();
    });

    after(function () {
        return closeServer();
    });
// For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.

    it('should get blog posts on GET', function (done) {
        chai.request(app)
            .get('/blogpost')
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.length.should.be.at.least(1);
                const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
                res.body.forEach(function (item) {
                    item.should.be.a('object');
                    item.should.include.keys(expectedKeys);
                });
            });
        done();
    });

    it('should add a blog post on POST', function (done) {
        const newItem = {
            title: 'blog3',
            content: 'some blog stuff',
            author: 'john',
            publishDate: '4/13'
        };
        const expectedKeys = ['id'].concat(Object.keys(newItem));
         chai.request(app)
            .post('/blogpost')
            .send(newItem)
            .then(function (res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.include.keys(expectedKeys);
                res.body.id.should.not.be.null;
                res.body.title.should.equal(newItem.title);
                res.body.content.should.equal(newItem.content);
                res.body.author.should.equal(newItem.author)
            });
        done();
    });

    it('should update blog posts on PUT', function (done) {
        chai.request(app)
            // first have to get
            .get('/blog-posts')
            .end(function (err, res) {
                const updatedPost = Object.assign(res.body[0], {
                    title: 'connect the dots',
                    content: 'la la la la la'
                });
                chai.request(app)
                    .put(`/blog-posts/${res.body[0].id}`)
                    .send(updatedPost)
                    .end(function (err, res) {
                        res.should.have.status(204);
                        res.should.be.json;
                    });
            })
        done();
    });

    it('should delete blog post on DELETE', function (done) {
        chai.request(app)
            .get('/blogpost')
            .end(function (err, res) {
                chai.request(app)
                    .delete(`/blogpost/${res.body[0].id}`)
                    .end(function (err, res) {
                        res.should.have.status(204);
                    });
            })
        done();
    });

});
