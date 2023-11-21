import { Request, Response } from "express";

const drafts: Map<string, Draft> = new Map();

/** Returns a list of all the named save files. */
export function Dummy(req: Request, res: Response) {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
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

//represents a draft
type Draft = {
  //draft id
  id: string;

  //whether or not the draft is currently in action (false when last pick is made)
  start: boolean;

  //number of rounds
  rounds: number;

  //current draft round
  currRound: number

  //an array of all the drafters in the order which they shall draft
  drafters: string[];

  //an array of all the possible options drafters can draft from
  options: string[];

  //the current drafter who's turn it is
  currPick: string;

  //a list of all picks that have been made thus far
  picks: Pick[];
}

//represents a draft pick
type Pick = {
  //name of the draft pick
  name: string;

  //the number they were drafted in
  num: number;

  //name of drafter who drafted them
  drafter: string;
}

/** expects a id string, rounds number, drafters array and options array as a request. 
 * sends a new draft tailored to the user's specifications as a response
 * updates drafts by adding the new draft to it. 
*/
export function createDraft(req: Request, res: Response) {
  const id = first(req.body.id);
  if (id === undefined) {
    res.status(500).send("missing draft id");
    return;
  }
  if (typeof id !== 'string') {
    res.status(500).send("draft id is of wrong type");
    return;
  }
  const rounds = req.body.rounds;
  if (rounds === undefined) {
    res.status(500).send("missing number of rounds");
    return;
  }
  if (typeof rounds !== 'number') {
    res.status(500).send("number of rounds must be a number");
    return;
  }
  const drafters = req.body.drafters;
  if (drafters === undefined) {
    res.status(500).send("there must be at least one drafter");
    return;
  }
  if (!Array.isArray(drafters)) {
    res.status(500).send("drafters must be an array");
    return;
  }
  if (drafters.length === 0) {
    res.status(400).send("there must be at least one drafter");
    return;
  }
  const options = req.body.options;
  if (options === undefined) {
    res.status(500).send("there must be at least one draft option");
    return;
  }
  if (!Array.isArray(options)) {
    res.status(500).send("options must be an array");
    return;
  }
  if (options.length === 0) {
    res.status(400).send("there must be at least one draft option");
    return;
  }
  if (options.length < (drafters.length * rounds)) {
    res.status(400).send("there must be at least as many options as there are total picks");
    return;
  }
  const draft : Draft = {
    id: id,
    start: true,
    rounds: rounds,
    currRound: 1,
    drafters: drafters,
    options: options,
    currPick: drafters[0],
    picks: []
  };
  drafts.set(draft.id, draft);
  res.send(draft);
}

/** expects a id string and a option string as a request.
 * expects the id string to be a key in drafts and the option string to be contained in
 * the corresponding draft's options array.
 * sends a new updated draft following the pick as a response.
 * updates the draft stored in drafts to reflect the pick.
*/
export function makePick(req: Request, res: Response) {
  const id = req.body.id;
  if (id === undefined) {
    res.status(500).send("no draft id");
    return;
  }
  if (!drafts.has(id)) {
    res.status(500).send("invalid id");
    return;
  }
  const draft = drafts.get(id);
  if (draft === undefined) {
    res.status(500).send("invalid draft");
    return;
  }
  const option = req.body.option;
  if (option === undefined) {
    res.status(500).send("you must select a draft option");
    return;
  }
  const c = draft.options.indexOf(option);
  if (c === -1) {
    res.status(500).send("invalid draft option");
    return;
  }
  draft.options.splice(c, 1);
  const pick : Pick = {
    name: option,
    num: draft.picks.length + 1,
    drafter: draft.currPick
  };
  draft.picks.push(pick);
  if (draft.drafters[draft.drafters.length - 1] === draft.currPick) {
    if (draft.currRound === draft.rounds) {
      draft.start = false;
    }
    else {
      draft.currRound = draft.currRound + 1;
      draft.currPick = draft.drafters[0];
    }
  }
  else {
    draft.currPick = draft.drafters[draft.drafters.indexOf(draft.currPick) + 1];
  }
  res.send(draft);
}

/** expects a id string as a request.
 * expects the id string to be a key in drafts.
 * sends the corresponding draft in drafts as a response.
 */
export function viewDraft(req: Request, res: Response) {
  const id = req.body.id;
  if (id === undefined) {
    res.status(500).send("no draft id");
    return;
  }
  if (!drafts.has(id)) {
    res.status(500).send("draft id does not exist");
    return;
  }
  res.send(drafts.get(id));
}

/** sends all the draft ids currently stored as keys in drafts */
export function viewIds(_req: Request, res: Response) {
  const ids = Array.from(drafts.keys());
  res.send({files: ids});
}

/** resets drafts such that it no longer stores any drafts. */
export function reset() {
  drafts.clear();
}






