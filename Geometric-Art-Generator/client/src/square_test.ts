import * as assert from 'assert';
import { solid, split, toJson, fromJson, Square, retrieve, set } from './square';
import { cons, nil } from './list';


describe('square', function() {

  it('toJson', function() {
    assert.deepEqual(toJson(solid("white")), "white");
    assert.deepEqual(toJson(solid("green")), "green");

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepEqual(toJson(s1),
      ["blue", "orange", "purple", "white"]);

    const s2 = split(s1, solid("green"), s1, solid("red"));
    assert.deepEqual(toJson(s2),
      [["blue", "orange", "purple", "white"], "green",
       ["blue", "orange", "purple", "white"], "red"]);

    const s3 = split(solid("green"), s1, solid("yellow"), s1);
    assert.deepEqual(toJson(s3),
      ["green", ["blue", "orange", "purple", "white"],
       "yellow", ["blue", "orange", "purple", "white"]]);
  });

  it('fromJson', function() {
    assert.deepEqual(fromJson("white"), solid("white"));
    assert.deepEqual(fromJson("green"), solid("green"));

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepEqual(fromJson(["blue", "orange", "purple", "white"]), s1);

    assert.deepEqual(
        fromJson([["blue", "orange", "purple", "white"], "green",
                 ["blue", "orange", "purple", "white"], "red"]),
        split(s1, solid("green"), s1, solid("red")));

    assert.deepEqual(
        fromJson(["green", ["blue", "orange", "purple", "white"],
                  "yellow", ["blue", "orange", "purple", "white"]]),
        split(solid("green"), s1, solid("yellow"), s1));
  });


  it('retrieve', function() {
    const s1: Square = solid("white");
    const s2: Square = solid("blue");

    //0-1-many heuristic, base case #1
    assert.deepStrictEqual(retrieve(s1, nil), s1);

    //0-1-many heuristic, base case #1
    assert.deepStrictEqual(retrieve(s2, nil), s2);

    //0-1-many heuristic, base case #2
    assert.deepStrictEqual(retrieve(s2, cons("NW", nil)), s2);

    //0-1-many heuristic, base case #2
    assert.deepStrictEqual(retrieve(s1, cons("NW", cons("SW", nil))), s1);


    const s3: Square = solid("green");
    const s4: Square = solid("red");
    const s5: Square = split(s1, s2, s3, s4);

    //0-1-many heuristic, one recursive call
    assert.deepStrictEqual(retrieve(s5, cons("NW", nil)), s1);

    //0-1-many heuristic, one recursive call
    assert.deepStrictEqual(retrieve(s5, cons("SW", nil)), s3);

    const s6: Square = split(s1, s2, s3, s5);

    //0-1-many heuristic, 2+ recursive calls
    assert.deepStrictEqual(retrieve(s6, cons("SE", cons("NE", nil))), s2);

    //0-1-many heuristic, 2+ recursive calls
    assert.deepStrictEqual(retrieve(s6, cons("SE", cons("SE", nil))), s4);
  });


  it('set', function() {
    const s1: Square = solid("white");
    const s2: Square = solid("blue");

    //0-1-many heuristic, base case #1
    assert.deepStrictEqual(set(s1, nil, s2), s2);

    //0-1-many heuristic, base case #1
    assert.deepStrictEqual(set(s2, nil, s1), s1);

    //0-1-many heuristic, base case #2
    assert.deepStrictEqual(set(s1, cons("NW", nil), s2), s2);

    //0-1-many heuristic, base case #2
    assert.deepStrictEqual(set(s2, cons("SE", nil), s1), s1);

    const s3: Square = solid("green");
    const s4: Square = solid("yellow");
    const s5: Square = split(s1, s2, s3, s4);

    //0-1-many heuristic, one recursive call
    assert.deepStrictEqual(set(s5, cons("NE", nil), s1), split(s1, s1, s3, s4));

    //0-1-many heurstic one recursive call
    assert.deepStrictEqual(set(s5, cons("SW", nil), s1), split(s1, s2, s1, s4));

    const s6: Square = split(s1, s2, s3, s5);
    const s7: Square = split(s1, s2, s1, s4);
    const s8: Square = split(s1, s3, s3, s4);

    //0-1-many heuristic, 2+ recursive calls
    assert.deepStrictEqual(set(s6, cons("SE", cons("SW", nil)), s1), split(s1, s2, s3, s7));

    //0-1-many heuristic, 2+ recursive calls
    assert.deepStrictEqual(set(s6, cons("SE", cons("NE", nil)), s3), split(s1, s2, s3, s8));
  })

});
