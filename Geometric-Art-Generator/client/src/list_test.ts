import * as assert from 'assert';
import { nil, cons, equals, len, concat, rev, prefix, suffix,
         compact_list, explode_array } from './list';


describe('list', function() {

  it('len', function() {
    const l1 = cons(1, nil);
    const l2 = cons(1, cons(2, nil));
    const l3 = cons(3, cons(2, cons(1, nil)));

    assert.strictEqual(equals(l1, nil), false);
    assert.strictEqual(equals(l1, l1), true);
    assert.strictEqual(equals(l1, l2), false);
    assert.strictEqual(equals(l1, l3), false);

    assert.strictEqual(equals(l2, nil), false);
    assert.strictEqual(equals(l2, l1), false);
    assert.strictEqual(equals(l2, l2), true);
    assert.strictEqual(equals(l2, l3), false);

    assert.strictEqual(equals(l3, nil), false);
    assert.strictEqual(equals(l3, l1), false);
    assert.strictEqual(equals(l3, l2), false);
    assert.strictEqual(equals(l3, l3), true);
  });

  it('len', function() {
    assert.deepEqual(len(nil), 0);
    assert.deepEqual(len(cons(1, nil)), 1);
    assert.deepEqual(len(cons(1, cons(2, nil))), 2);
    assert.deepEqual(len(cons(3, cons(2, cons(1, nil)))), 3);
  });
  
  it('concat', function() {
    assert.deepEqual(concat(nil, nil), nil);
    assert.deepEqual(concat(nil, cons(1, nil)), cons(1, nil));
    assert.deepEqual(concat(nil, cons(1, cons(2, nil))), cons(1, cons(2, nil)));

    assert.deepEqual(concat(cons(1, nil), nil), cons(1, nil));
    assert.deepEqual(concat(cons(1, nil), cons(2, nil)), cons(1, cons(2, nil)));
    assert.deepEqual(concat(cons(1, nil), cons(2, cons(3, nil))),
        cons(1, cons(2, cons(3, nil))));

    assert.deepEqual(concat(cons(1, cons(2, nil)), nil), cons(1, cons(2, nil)));
    assert.deepEqual(concat(cons(1, cons(2, nil)), cons(3, nil)),
        cons(1, cons(2, cons(3, nil))));
    assert.deepEqual(concat(cons(1, cons(2, nil)), cons(3, cons(4, nil))),
        cons(1, cons(2, cons(3, cons(4, nil)))));
  });

  it('rev', function() {
    assert.deepEqual(rev(nil), nil);
    assert.deepEqual(rev(cons(1, nil)), cons(1, nil));
    assert.deepEqual(rev(cons(2, nil)), cons(2, nil));
    assert.deepEqual(rev(cons(1, cons(2, nil))), cons(2, cons(1, nil)));
    assert.deepEqual(rev(cons(1, cons(2, cons(3, nil)))),
        cons(3, cons(2, cons(1, nil))));
  });

  it('prefix', function() {
    assert.deepEqual(prefix(0, nil), nil);

    assert.deepEqual(prefix(0, cons(3, nil)), nil);
    assert.deepEqual(prefix(1, cons(3, nil)), cons(3, nil));

    const l5 = cons(1, cons(2, cons(3, cons(4, cons(5, nil)))));
    assert.deepEqual(prefix(0, l5), nil);
    assert.deepEqual(prefix(1, l5), cons(1, nil));
    assert.deepEqual(prefix(2, l5), cons(1, cons(2, nil)));
    assert.deepEqual(prefix(3, l5), cons(1, cons(2, cons(3, nil))));
    assert.deepEqual(prefix(4, l5), cons(1, cons(2, cons(3, cons(4, nil)))));
    assert.deepEqual(prefix(5, l5), l5);
  });

  it('suffix', function() {
    assert.deepEqual(suffix(0, nil), nil);

    assert.deepEqual(suffix(0, cons(3, nil)), cons(3, nil));
    assert.deepEqual(suffix(1, cons(3, nil)), nil);

    const l5 = cons(1, cons(2, cons(3, cons(4, cons(5, nil)))));
    assert.deepEqual(suffix(0, l5), l5);
    assert.deepEqual(suffix(1, l5), cons(2, cons(3, cons(4, cons(5, nil)))));
    assert.deepEqual(suffix(2, l5), cons(3, cons(4, cons(5, nil))));
    assert.deepEqual(suffix(3, l5), cons(4, cons(5, nil)));
    assert.deepEqual(suffix(4, l5), cons(5, nil));
    assert.deepEqual(suffix(5, l5), nil);
  });

  it('compact_list', function() {
    assert.deepEqual(compact_list(nil), []);
    assert.deepEqual(compact_list(cons(1, nil)), [1]);
    assert.deepEqual(compact_list(cons(1, cons(2, nil))), [1, 2]);
    assert.deepEqual(compact_list(cons(3, cons(2, cons(1, nil)))), [3, 2, 1]);
  });

  it('explode_array', function() {
    assert.deepEqual(explode_array([]), nil);
    assert.deepEqual(explode_array([1]), cons(1, nil));
    assert.deepEqual(explode_array([1, 2]), cons(1, cons(2, nil)));
    assert.deepEqual(explode_array([1, 2, 3]), cons(1, cons(2, cons(3, nil))));
  });

});
