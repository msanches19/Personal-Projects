import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { Dummy, files, list, load, reset, save } from './routes';


describe('routes', function() {

  // After you know what to do, feel free to delete this Dummy test
  it('Dummy', function() {
    // Feel free to copy this test structure to start your own tests, but look at these
    // comments first to understand what's going on.

    // httpMocks lets us create mock Request and Response params to pass into our route functions
    const req1 = httpMocks.createRequest(
        // query: is how we add query params. body: {} can be used to test a POST request
        {method: 'GET', url: '/api/dummy', query: {name: 'Kevin'}}); 
    const res1 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    Dummy(req1, res1);

    // check that the request was successful
    assert.strictEqual(res1._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepEqual(res1._getJSONData(), 'Hi, Kevin');
  });


  it('save', function() {

    //expected input test #1
    const req2 = httpMocks.createRequest( 
      {method: 'POST', url: '/api/save', body: {name: 'file1', content: "This is a test"}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getJSONData(), 'file1 has been saved');

    //expected input test #2
    const req4 = httpMocks.createRequest(
      {method: 'POST', url: ' /api/save', body: {name: "new file", content: "This is a test"}});
    const res4 = httpMocks.createResponse();
    save(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getJSONData(), "new file has been saved");

    //unexpected input (no name) test #1
    const req3 = httpMocks.createRequest(
      {method: 'POST', url: ' /api/save', body: {name: undefined, content: "This is a test"}});
    const res3 = httpMocks.createResponse();
    save(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);

    //unexpected input (no name) test #2
    const req5 = httpMocks.createRequest(
      {method: 'POST', url: ' /api/save', body: {name: "  ", content: "This is a test"}});
    const res5 = httpMocks.createResponse();
    save(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);

    //unexpected input (name is not of type string)
    const req7 = httpMocks.createRequest(
      {method: 'POST', url: ' /api/save', body: {name: 12, content: "This is a test"}});
    const res7 = httpMocks.createResponse();
    save(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 400);

    //unexpected input (no content)
    const req6 = httpMocks.createRequest(
      {method: 'POST', url : ' /api/save', body: {name: "string", content: undefined}});
    const res6 = httpMocks.createResponse();
    save(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 500);


    reset();


  });


  it('load', function() {
    files.set("file1", "string1");
    files.set("file2", "string2");
    files.set("file3", "string3");

    //expected input (name is in files) test #1
    const req1 = httpMocks.createRequest(
      {method: 'GET', url: ' /api/load', query: {name: "file1"}});
    const res1 = httpMocks.createResponse();
    load(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getJSONData(), {name: "string1"});

    //expected input (name is in files) test #2
    const req2 = httpMocks.createRequest(
      {method: 'GET', url: ' /api/load', query: {name: "file2"}});
    const res2 = httpMocks.createResponse();
    load(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getJSONData(), {name : "string2"});

    //unexpected input (name is not in files) test #1
    const req3 = httpMocks.createRequest(
      {method: 'GET', url: ' /api/load', query: {name: "file5"}});
    const res3 = httpMocks.createResponse();
    load(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);

    //unexpected input (name is not in files) test #2
    const req4 = httpMocks.createRequest(
      {method: 'GET', url: ' /api/load', query: {name: "file25"}});
    const res4 = httpMocks.createResponse();
    load(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);

    //unexpected input (name is undefined)
    const req5 = httpMocks.createRequest(
      {method: 'GET', url: ' /api/load', query: {name: undefined}});
    const res5 = httpMocks.createResponse();
    load(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);

    //unexpected input (name is not of type string)
    const req6 = httpMocks.createRequest(
      {method: 'GET', url: ' /api/load', query: {name: 12}});
    const res6 = httpMocks.createResponse();
    load(req6, res6);
    assert.strictEqual(res5._getStatusCode(), 400);

    reset();
  })


  it('list', function() {
    files.set("file1", "string1");
    files.set("file2", "string2");
    files.set("file3", "string3");

    // test #1 (list doesn't rely on any input)
    const req2 = httpMocks.createRequest(
      {method: 'GET', url: ' /api/list', params:{}});
    const res2 = httpMocks.createResponse();
    list(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getJSONData(), {files: ["file1", "file2", "file3"]});


    files.set("file4", "string4");
    files.set("file5", "string5");
    files.set("string6", "file6");

    //test #2 (list doesn't rely on any input)
    const req3 = httpMocks.createRequest(
      {method: 'GET', url: ' /api/list', params:{}});
    const res3 = httpMocks.createResponse();
    list(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getJSONData(), {files: ["file1", "file2", "file3", "file4", "file5", "string6"]});
    reset();
  })
});
