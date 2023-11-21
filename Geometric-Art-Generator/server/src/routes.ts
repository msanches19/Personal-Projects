import { Request, Response } from "express";


/** Returns a list of all the named save files. */
export function Dummy(req: Request, res: Response) {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(500).send('missing "name" parameter');
  } else {
    res.json(`Hi, ${name}`);
  }
}


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
function first(param: any): string|undefined {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
}
/** a map with names as keys and content (strings representing a square object) as values.  */
export const files = new Map<String, String>();

/** expects a name string and a content string as a request, otherwise error response will be sent. 
 * sends response with string data stating that the save procedure has been successful. 
 * updates files with the request's name and content strings. 
 */
export function save(req : Request, res : Response) {
 const name = first(req.body.name);
 if (name === undefined || typeof name !== 'string') {
  res.status(400).send("missing name parameter");
  return;
 }
 if (name.trim() === "") {
  res.status(400).send("file name must contain at least one character");
  return;
 }
 const content = req.body.content;
 if (content === undefined || typeof content !== 'string') {
  res.status(500).send("square does not exist");
  return;
 }
 files.set(name, content);
 res.json(name + ' has been saved');
}

/** expects a name string as a requent, otherwise an erorr response will be sent. 
 * expects the name string to be a key in files, otherwise an error response will be sent. 
 * send the name string's value in files as the response. 
 */
export function load(req: Request, res: Response) {
  const name = first(req.query.name);
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send("missing 'name' parameter");
    return;
  }
  if (!files.has(name)) {
    res.status(400).send("file does not exist");
    return;
  }
  res.json({name: files.get(name)});
}
/** sends an array representing the keys of files as a response. */
export function list(_req: Request, res: Response) {
  const list = Array.from(files.keys());
  res.json({files: list});
}

/** updates files to be an empty map.  */
export function reset() {
  files.clear();
}

