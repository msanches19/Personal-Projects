import { List, nil } from './list';


export type Color = "white" | "red" | "orange" | "yellow" | "green" | "blue" | "purple";

export type Square =
    | {readonly kind: "solid", readonly color: Color}
    | {readonly kind: "split", readonly nw: Square, readonly ne: Square,
       readonly sw: Square, readonly se: Square};

export function solid(color: Color): Square {
  return {kind: "solid", color: color};
}

export function split(nw: Square, ne: Square, sw: Square, se: Square): Square {
  return {kind: "split", nw: nw, ne: ne, sw: sw, se: se};
}


/** Returns JSON describing the given Square. */
export function toJson(sq: Square): any {
  if (sq.kind === "solid") {
    return sq.color;
  } else {
    return [toJson(sq.nw), toJson(sq.ne), toJson(sq.sw), toJson(sq.se)];
  }
}

/** Converts a JSON description to the Square it describes. */
export function fromJson(data: any): Square {
  if (typeof data === 'string') {
    switch (data) {
      case "white": case "red": case "orange": case "yellow":
      case "green": case "blue": case "purple":
        return solid(data);

      default:
        throw new Error(`unknown color "${data}"`);
    }
  } else if (Array.isArray(data)) {
    if (data.length === 4) {
      return split(fromJson(data[0]), fromJson(data[1]),
                   fromJson(data[2]), fromJson(data[3]));
    } else {
      throw new Error('split must have 4 parts');
    }
  } else {
    throw new Error(`type ${typeof data} is not a valid square`);
  }
}


/** Indicates one of the four parts of a split. */
export type Dir = "NW" | "NE" | "SE" | "SW";

/** Describes how to get to a square from the root of the tree. */
export type Path = List<Dir>;

/**
 * Given a root square and a path, this method retrieves the square at the end of the path. 
 * @param s the root square
 * @param p the desired path
 * @returns the square at the end of the path
 */
export function retrieve(s: Square, p: Path): Square {
  if (p === nil) {
    return s;
  }
  if (s.kind === "solid") {
    return s;
  }
  if (p.hd === "NW") {
    return retrieve(s.nw, p.tl);
  }
  if (p.hd === "NE") {
    return retrieve(s.ne, p.tl);
  }
  if (p.hd === "SE") {
    return retrieve(s.se, p.tl);
  }
  return retrieve(s.sw, p.tl);
}


/**
 * Given a root square and a path, this method replaces the square at the end of the path 
 * with a desired square
 * @param s the root square
 * @param p the desired path to the square to be replaced
 * @param s2 the square to replace the square at the end of the path
 * @returns An updated copy of the root square but with the square at the end of the path being
 * replaced by the desired square
 */
export function set(s: Square, p: Path, s2: Square) : Square {
  if (p === nil) {
    return s2;
  }
  if (s.kind === "solid") {
    return s2;
  }
  if (p.hd === "NW") {
    return split(set(s.nw, p.tl, s2), s.ne, s.sw, s.se);
  }
  if (p.hd === "NE") {
    return split(s.nw, set(s.ne, p.tl, s2), s.sw, s.se);
  }
  if (p.hd === "SW") {
    return split(s.nw, s.ne, set(s.sw, p.tl, s2), s.se);
  }
  return split(s.nw, s.ne, s.sw, set(s.se, p.tl, s2));
}