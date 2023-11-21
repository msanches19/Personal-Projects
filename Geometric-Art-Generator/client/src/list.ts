export type List<A> =
    | "nil"
    | {readonly kind: "cons", readonly hd: A, readonly tl: List<A>};

export const nil = "nil";

export function cons<A>(hd: A, tl: List<A>): List<A> {
  if (hd < 0 || 65536 <= hd)
    throw new Error(`invalid char code "${hd}"`)
  return {kind: "cons", hd: hd, tl: tl};
}


/**
 * Determines whether L and R contain the same (===) elements in the same order
 * @param L first list to compare
 * @param R second list to compare
 * @returns true if both are nil or both are non-nil, L.hd === R.hd, and
 *     equals(L.tl, R.tl)
 */
export function equals<A>(L: List<A>, R: List<A>): boolean {
  if (L === nil) {
    return R === nil;
  } else if (R === nil) {
    return false;
  } else if (L.hd !== R.hd) {
    return false;
  } else {
    return equals(L.tl, R.tl);
  }
}

/**
 * Returns the length of the list.
 * @param L list whose length should be returned
 * @returns 0 if L = nil else 1 + len(tail(L))
 */
export function len<A>(L: List<A>): number {
  if (L === nil) {
    return 0;
  } else {
    return 1 + len(L.tl);
  }
}

/**
 * Returns the a list consisting of L followed by R.
 * @param L list to go at the front of the result
 * @param R list to go at the end of the result
 * @returns A single list consisting of L's elements followed by R's
 */
export function concat<A>(L: List<A>, R: List<A>): List<A> {
  if (L === nil) {
    return R;
  } else {
    return cons(L.hd, concat(L.tl, R));
  }
}

/**
 * Returns the reverse of the given list.
 * @param L list to revese
 * @returns list containing the same elements but in reverse order
 */
export function rev<A>(L: List<A>): List<A> {
  if (L === nil) {
    return nil;
  } else {
    return concat(rev(L.tl), cons(L.hd, nil));
  }
}

/**
 * Returns the first n elements of the list.
 * @param n number of elements to return
 * @param L list in question
 * @requires n <= len(L) 
 * @returns nil if n = 0 else cons(L.hd, prefix(n - 1, L.tl))
 */
export function prefix<A>(n: number, L: List<A>): List<A> {
  if (n === 0) {
    return nil;
  } else if (L === nil) {
    throw new Error('ran out of elements trying to get a prefix');
  } else {
    return cons(L.hd, prefix(n - 1, L.tl));
  }
}

/**
 * Returns everything after the first n elements of the list.
 * @param n number of elements to skip
 * @param L list in question
 * @requires n <= len(L) 
 * @returns L if n = 0 else suffix(n - 1, L.tl)
 */
export function suffix<A>(n: number, L: List<A>): List<A> {
  if (n === 0) {
    return L;
  } else if (L === nil) {
    throw new Error('ran out of elements trying to get a suffix');
  } else {
    return suffix(n - 1, L.tl);
  }
}

/**
 * Returns the elements of a list, packed into an array.
 * @param L the list to turn into an array
 * @returns array containing the same elements as in L in the same order
 */
export function compact_list<A>(L: List<A>): Array<A> {
  const arr: A[] = [];
  while (L !== nil) {
      arr.push(L.hd);
      L = L.tl;
  }
  return arr;
}

/**
 * Returns the elements in the given array as a list.
 * @param arr the array to turn into a list
 * @returns list containing the same elements as in arr in the same order
 */
export function explode_array<A>(arr: ReadonlyArray<A>): List<A> {
  let L: List<A> = nil;
  for (let i = arr.length - 1; i >= 0; i--) {
      L = cons(arr[i], L);
  }
  return L;
}