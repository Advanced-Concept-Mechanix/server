//here we test the whole integration -  end to end test for expected outputs
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app =  require('package.json');

//building the test
