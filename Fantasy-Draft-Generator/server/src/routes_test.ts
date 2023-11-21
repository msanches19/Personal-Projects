import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { Dummy, createDraft, makePick, reset, viewDraft, viewIds } from './routes';


describe('routes', function() {

  it('Dummy', function() {
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/dummy', query: {name: 'Kevin'}});
    const res1 = httpMocks.createResponse();
    Dummy(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepEqual(res1._getJSONData(), 'Hi, Kevin');
  });


  const draft1 = {
    id: "abc",
    start: true,
    rounds: 2,
    currRound: 1,
    drafters: ["GM 1", "GM 2"],
    options: ["Neymar", "Vini Jr.", "Mbappe", "Haaland"],
    currPick: "GM 1",
    picks: []
  }
  const draft1update1 = {
    id: "abc",
    start: true,
    rounds: 2,
    currRound: 1,
    drafters: ["GM 1", "GM 2"],
    options: ["Vini Jr.", "Mbappe", "Haaland"],
    currPick: "GM 2",
    picks: [{name: "Neymar", num: 1, drafter: "GM 1"}]
  }

  const draft1update2 = {
    id: "abc",
    start: true,
    rounds: 2,
    currRound: 2,
    drafters: ["GM 1", "GM 2"],
    options: ["Vini Jr.", "Haaland"],
    currPick: "GM 1",
    picks: [{name: "Neymar", num: 1, drafter: "GM 1"}, {name: "Mbappe", num: 2, drafter: "GM 2"}]
  }

  const draft1update3 = {
    id: "abc",
    start: true,
    rounds: 2,
    currRound: 2,
    drafters: ["GM 1", "GM 2"],
    options: ["Vini Jr."],
    currPick: "GM 2",
    picks: [{name: "Neymar", num: 1, drafter: "GM 1"}, {name: "Mbappe", num: 2, drafter: "GM 2"}, {name: "Haaland", num: 3, drafter: "GM 1"}]
  }

  const draft1update4 = {
    id: "abc",
    start: false,
    rounds: 2,
    currRound: 2,
    drafters: ["GM 1", "GM 2"],
    options: [],
    currPick: "GM 2",
    picks: [{name: "Neymar", num: 1, drafter: "GM 1"}, {name: "Mbappe", num: 2, drafter: "GM 2"}, {name: "Haaland", num: 3, drafter: "GM 1"}, 
            {name: "Vini Jr.", num: 4, drafter: "GM 2"}]
  }
  const draft2 = {
    id: "xyz",
    start: true,
    rounds: 3,
    currRound: 1,
    drafters: ["GM 3", "GM 2", "GM 1"],
    options: ["Lebron", "Curry", "Jokic", "Ja", "Giannis", "Doncic", "Booker", "Butler", "Shai", "Tatum"],
    currPick: "GM 3",
    picks: []
  }

  const draft2update1 = {
    id: "xyz",
    start: true,
    rounds: 3,
    currRound: 1,
    drafters: ["GM 3", "GM 2", "GM 1"],
    options: ["Curry", "Jokic", "Ja", "Giannis", "Doncic", "Booker", "Butler", "Shai", "Tatum"],
    currPick: "GM 2",
    picks: [{name: "Lebron", num: 1, drafter: "GM 3"}]
  }

  const draft2update2 = {
    id: "xyz",
    start: true,
    rounds: 3,
    currRound: 1,
    drafters: ["GM 3", "GM 2", "GM 1"],
    options: ["Jokic", "Ja", "Giannis", "Doncic", "Booker", "Butler", "Shai", "Tatum"],
    currPick: "GM 1",
    picks: [{name: "Lebron", num: 1, drafter: "GM 3"}, {name: "Curry", num: 2, drafter: "GM 2"}]
  }

  const draft2update3 = {
    id: "xyz",
    start: true,
    rounds: 3,
    currRound: 2,
    drafters: ["GM 3", "GM 2", "GM 1"],
    options: ["Jokic", "Ja", "Giannis", "Doncic", "Booker", "Shai", "Tatum"],
    currPick: "GM 3",
    picks: [{name: "Lebron", num: 1, drafter: "GM 3"}, {name: "Curry", num: 2, drafter: "GM 2"}, 
            {name: "Butler", num: 3, drafter: "GM 1"}]
  }

  it("createDraft", function() {

    //creating one valid draft
    const req1 = httpMocks.createRequest({method: 'POST', url: ' /api/createDraft', body: {id: "abc", rounds: 2, drafters: ["GM 1", "GM 2"], 
                                          options: ["Neymar", "Vini Jr.", "Mbappe", "Haaland"]}});
    const res1 = httpMocks.createResponse();
    createDraft(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), draft1);

    //creating another valid draft
    const options = ["Lebron", "Curry", "Jokic", "Ja", "Giannis", "Doncic", "Booker", "Butler", "Shai", "Tatum"];
    const req2 = httpMocks.createRequest({method: 'POST', url: '/api/createDraft', body: {id: "xyz", rounds: 3, drafters: ["GM 3", "GM 2", "GM 1"], 
                                          options: options}});
    const res2 = httpMocks.createResponse();
    createDraft(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(), draft2);

    //draft id is undefined -> invalid
    const req3 = httpMocks.createRequest({method: 'POST', url: ' /api/createDraft', body: {id: undefined, rounds: 2, drafters: ["GM 1", "GM 2"], 
                                          options: ["Neymar", "Vini Jr.", "Mbappe", "Haaland"]}});
    const res3 = httpMocks.createResponse();
    createDraft(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 500);

    //draft id is not a string -> invalid
    const req4 = httpMocks.createRequest({method: 'POST', url: ' /api/createDraft', body: {id: [], rounds: 2, drafters: ["GM 1", "GM 2"], 
                                          options: ["Neymar", "Vini Jr.", "Mbappe", "Haaland"]}});
    const res4 = httpMocks.createResponse();
    createDraft(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 500);

    //rounds is undefined -> invalid
    const req5 =  httpMocks.createRequest({method: 'POST', url: ' /api/createDraft', body: {id: "abc", rounds: undefined, drafters: ["GM 1", "GM 2"], 
                                          options: ["Neymar", "Vini Jr.", "Mbappe", "Haaland"]}});
    const res5 = httpMocks.createResponse();
    createDraft(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 500);  
    
    //rounds is not a number -> invalid
    const req6 = httpMocks.createRequest({method: 'POST', url: ' /api/createDraft', body: {id: "abc", rounds: "rounds", drafters: ["GM 1", "GM 2"], 
                                          options: ["Neymar", "Vini Jr.", "Mbappe", "Haaland"]}});
    const res6 = httpMocks.createResponse();
    createDraft(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 500);

    //drafters is undefined -> invalid
    const req7 = httpMocks.createRequest({method: 'POST', url: ' /api/createDraft', body: {id: "abc", rounds: 2, drafters: undefined, 
                                          options: ["Neymar", "Vini Jr.", "Mbappe", "Haaland"]}});
    const res7 = httpMocks.createResponse();
    createDraft(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 500);

    //drafters is not an array -> invalid
    const req8 = httpMocks.createRequest({method: 'POST', url: ' /api/createDraft', body: {id: "abc", rounds: 2, drafters: "GM 1, GM 2", 
                                          options: ["Neymar", "Vini Jr.", "Mbappe", "Haaland"]}});
    const res8 = httpMocks.createResponse();
    createDraft(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 500);

    //options is undefined -> invalid
    const req9 = httpMocks.createRequest({method: 'POST', url: ' /api/createDraft', body: {id: "abc", rounds: 2, drafters: ["GM 1", "GM 2"], 
                                         options: undefined}});
    const res9 = httpMocks.createResponse();
    createDraft(req9, res9);
    assert.strictEqual(res9._getStatusCode(), 500);

    //options is not an array -> invalid
    const req10 = httpMocks.createRequest({method: 'POST', url: ' /api/createDraft', body: {id: "abc", rounds: 2, drafters: ["GM 1", "GM 2"], 
                                            options: "Neymar, Vini Jr., Mbappe, Haaland"}});
    const res10 = httpMocks.createResponse();
    createDraft(req10, res10);
    assert.strictEqual(res10._getStatusCode(), 500);

    reset();
  })


  it("makePick", function() {
    const draft1Req = httpMocks.createRequest({method: 'POST', url: ' /api/createDraft', body: {id: "abc", rounds: 2, drafters: ["GM 1", "GM 2"], 
                      options: ["Neymar", "Vini Jr.", "Mbappe", "Haaland"]}});
    const draft1Res = httpMocks.createResponse();
    createDraft(draft1Req, draft1Res);

    //valid pick (first pick)
    const req1 = httpMocks.createRequest({method: "POST", url: ' /api/makePick', body: {id: "abc", option: "Neymar"}});
    const res1 = httpMocks.createResponse();
    makePick(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), draft1update1);

    //valid pick (still first round)
    const req2 = httpMocks.createRequest({method: "POST", url: ' /api/makePick', body: {id: "abc", option: "Mbappe"}});
    const res2 = httpMocks.createResponse();
    makePick(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(), draft1update2);

    //valid pick (round change)
    const req3 = httpMocks.createRequest({method: "POST", url: ' /api/makePick', body: {id: "abc", option: "Haaland"}});
    const res3 = httpMocks.createResponse();
    makePick(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(), draft1update3);

    //valid pick (end draft)
    const req4 = httpMocks.createRequest({method: "POST", url: ' /api/makePick', body: {id: "abc", option: "Vini Jr."}});
    const res4 = httpMocks.createResponse();
    makePick(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), draft1update4);

    const options = ["Lebron", "Curry", "Jokic", "Ja", "Giannis", "Doncic", "Booker", "Butler", "Shai", "Tatum"];
    const draft2req = httpMocks.createRequest({method: 'POST', url: '/api/createDraft', body: {id: "xyz", rounds: 3, drafters: ["GM 3", "GM 2", "GM 1"], 
    options: options}});
    const draft2res = httpMocks.createResponse();
    createDraft(draft2req, draft2res);

    //draft id is undefined -> invalid
    const req5 = httpMocks.createRequest({method: 'POST', url: ' /api/makePick', body: {id: undefined, option: "Lebron"}});
    const res5 = httpMocks.createResponse();
    makePick(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 500);

    //draft id does not correspond to a created draft -> invalid
    const req6 = httpMocks.createRequest({method: 'POST', url: ' /api/makePick', body: {id: "xy", option: "Lebron"}});
    const res6 = httpMocks.createResponse();
    makePick(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 500);

    //option is undefined -> invalid
    const req7 = httpMocks.createRequest({method: 'POST', url: ' /api/makePick', body: {id: "xyz", option: undefined}});
    const res7 = httpMocks.createResponse();
    makePick(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 500);

    //valid pick (first pick)
    const req8 = httpMocks.createRequest({method: 'POST', url: ' /api/makePick', body: {id: "xyz", option: "Lebron"}});
    const res8 = httpMocks.createResponse();
    makePick(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 200);
    assert.deepStrictEqual(res8._getData(), draft2update1);

    //option is not in draft's option list -> invalid
    const req11 = httpMocks.createRequest({method: 'POST', url: ' /api/makePick', body: {id: "xyz", option: "Lebron"}});
    const res11 = httpMocks.createResponse();
    makePick(req11, res11);
    assert.strictEqual(res11._getStatusCode(), 500);

    //valid pick
    const req9 = httpMocks.createRequest({method: 'POST', url: ' /api/makePick', body: {id: "xyz", option: "Curry"}});
    const res9 = httpMocks.createResponse();
    makePick(req9, res9);
    assert.strictEqual(res9._getStatusCode(), 200);
    assert.deepStrictEqual(res9._getData(), draft2update2);

    //valid pick (round change)
    const req10 = httpMocks.createRequest({method: 'POST', url: ' /api/makePick', body: {id: "xyz", option: "Butler"}});
    const res10 = httpMocks.createResponse();
    makePick(req10, res10);
    assert.strictEqual(res10._getStatusCode(), 200);
    assert.deepStrictEqual(res10._getData(), draft2update3);

    reset();
  })

  it("viewDraft", function() {
    const draft1Req = httpMocks.createRequest({method: 'POST', url: ' /api/createDraft', body: {id: "abc", rounds: 2, drafters: ["GM 1", "GM 2"], 
                      options: ["Neymar", "Vini Jr.", "Mbappe", "Haaland"]}});
    const draft1Res = httpMocks.createResponse();
    createDraft(draft1Req, draft1Res);

    //load valid draft before any picks have been made
    const req1 = httpMocks.createRequest({method: "POST", url: ' /api/loadDraft', body: {id: "abc"}});
    const res1 = httpMocks.createResponse();
    viewDraft(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), draft1);

    const req1pick1 = httpMocks.createRequest({method: "POST", url: ' /api/makePick', body: {id: "abc", option: "Neymar"}});
    const res1pick1 = httpMocks.createResponse();
    makePick(req1pick1, res1pick1);

    //load valid draft after first pick has been made
    const req2 = httpMocks.createRequest({method: "POST", url: ' /api/loadDraft', body: {id: "abc"}});
    const res2 = httpMocks.createResponse();
    viewDraft(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(), draft1update1);

  
    const req1pick2 = httpMocks.createRequest({method: "POST", url: ' /api/makePick', body: {id: "abc", option: "Mbappe"}});
    const res1pick2 = httpMocks.createResponse();
    makePick(req1pick2, res1pick2);

    //load valid draft after pick has been made
    const req3 = httpMocks.createRequest({method: "POST", url: ' /api/loadDraft', body: {id: "abc"}});
    const res3 = httpMocks.createResponse();
    viewDraft(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(), draft1update2);

    const req1pick3 = httpMocks.createRequest({method: "POST", url: ' /api/makePick', body: {id: "abc", option: "Haaland"}});
    const res1pick3 = httpMocks.createResponse();
    makePick(req1pick3, res1pick3);

    //load valid pick after pick has been made and round has changed
    const req4 = httpMocks.createRequest({method: "POST", url: ' /api/loadDraft', body: {id: "abc"}});
    const res4 = httpMocks.createResponse();
    viewDraft(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), draft1update3);

    const req1pick4 = httpMocks.createRequest({method: "POST", url: ' /api/makePick', body: {id: "abc", option: "Vini Jr."}});
    const res1pick4 = httpMocks.createResponse();
    makePick(req1pick4, res1pick4);

    //load valid draft after draft has ended
    const req5 = httpMocks.createRequest({method: "POST", url: ' /api/loadDraft', body: {id: "abc"}});
    const res5 = httpMocks.createResponse();
    viewDraft(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), draft1update4);

    const options = ["Lebron", "Curry", "Jokic", "Ja", "Giannis", "Doncic", "Booker", "Butler", "Shai", "Tatum"];
    const draft2req = httpMocks.createRequest({method: 'POST', url: '/api/createDraft', body: {id: "xyz", rounds: 3, drafters: ["GM 3", "GM 2", "GM 1"], 
                                          options: options}});
    const draft2res = httpMocks.createResponse();
    createDraft(draft2req, draft2res);

    //draft id is undefined -> invalid
    const req6 = httpMocks.createRequest({method: "POST", url: ' /api/loadDraft', body: {id: undefined}});
    const res6 = httpMocks.createResponse();
    viewDraft(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 500);

    //draft id does not correspond to a created draft -> invalid
    const req7 = httpMocks.createRequest({method: "POST", url: ' /api/loadDraft', body: {id: "abcxyz"}});
    const res7 = httpMocks.createResponse();
    viewDraft(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 500);

    //load valid draft before any picks have been made
    const req8 = httpMocks.createRequest({method: "POST", url: ' /api/loadDraft', body: {id: "xyz"}});
    const res8 = httpMocks.createResponse();
    viewDraft(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 200);
    assert.deepStrictEqual(res8._getData(), draft2);

    
    const req2pick1 = httpMocks.createRequest({method: 'POST', url: ' /api/makePick', body: {id: "xyz", option: "Lebron"}});
    const res2pick1 = httpMocks.createResponse();
    makePick(req2pick1, res2pick1);

    //load valid draft after first pick is made
    const req9 = httpMocks.createRequest({method: "POST", url: ' /api/loadDraft', body: {id: "xyz"}});
    const res9 = httpMocks.createResponse();
    viewDraft(req9, res9);
    assert.strictEqual(res9._getStatusCode(), 200);
    assert.deepStrictEqual(res9._getData(), draft2update1);

    const req2pick2 = httpMocks.createRequest({method: 'POST', url: ' /api/makePick', body: {id: "xyz", option: "Curry"}});
    const res2pick2 = httpMocks.createResponse();
    makePick(req2pick2, res2pick2);

    //load valid draft after pick has been made
    const req10 = httpMocks.createRequest({method: "POST", url: ' /api/loadDraft', body: {id: "xyz"}});
    const res10 = httpMocks.createResponse();
    viewDraft(req10, res10);
    assert.strictEqual(res10._getStatusCode(), 200);
    assert.deepStrictEqual(res10._getData(), draft2update2);

    const req2pick3 = httpMocks.createRequest({method: 'POST', url: ' /api/makePick', body: {id: "xyz", option: "Butler"}});
    const res2pick3 = httpMocks.createResponse();
    makePick(req2pick3, res2pick3);

    //load valid draft after pick has been made and round has changed
    const req11 = httpMocks.createRequest({method: "POST", url: ' /api/loadDraft', body: {id: "xyz"}});
    const res11 = httpMocks.createResponse();
    viewDraft(req11, res11);
    assert.strictEqual(res11._getStatusCode(), 200);
    assert.deepStrictEqual(res11._getData(), draft2update3);

    reset();
  })

  it("viewIds", function() {
    //view ids before any drafts have been made
    const req3 = httpMocks.createRequest({method: 'GET', url: ' /api/viewIds'});
    const res3 = httpMocks.createResponse();
    viewIds(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(), {files: []});

    const draft1Req = httpMocks.createRequest({method: 'POST', url: ' /api/createDraft', body: {id: "abc", rounds: 2, drafters: ["GM 1", "GM 2"], 
                      options: ["Neymar", "Vini Jr.", "Mbappe", "Haaland"]}});
    const draft1Res = httpMocks.createResponse();
    createDraft(draft1Req, draft1Res);

    //view ids after a draft has been made
    const req1 = httpMocks.createRequest({method: 'GET', url: ' /api/viewIds'});
    const res1 = httpMocks.createResponse();
    viewIds(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {files: ["abc"]});

    const options = ["Lebron", "Curry", "Jokic", "Ja", "Giannis", "Doncic", "Booker", "Butler", "Shai", "Tatum"];
    const draft2req = httpMocks.createRequest({method: 'POST', url: '/api/createDraft', body: {id: "xyz", rounds: 3, drafters: ["GM 3", "GM 2", "GM 1"], 
                                          options: options}});
    const draft2res = httpMocks.createResponse();
    createDraft(draft2req, draft2res);

    //view ids after multiple drafts have been made
    const req2 = httpMocks.createRequest({method: 'GET', url: ' /api/viewIds'});
    const res2 = httpMocks.createResponse();
    viewIds(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(), {files: ["abc", "xyz"]});
    
    reset();
  })

});
