const chai = require('chai');
const chaiHttp = require('chai-http');

const port = 8080;//process.argv[2] || process.env.PORT || 8080;

const url = `http://localhost:${port}`;

chai.use(chaiHttp);

it('Returns a shortened URL.', (done) => {
  chai.request(url)
    .get('/shorten/?url=http://www.google.com')
    .end((err, res) => {
      chai.expect(err).to.be.null;
      chai.expect(res).to.have.status(200);
      const json = {
        longUrl: 'http://www.google.com',
        shortUrl: '000',
      };
      chai.expect(res.text).to.equal(JSON.stringify(json));
      done();
    });
});
