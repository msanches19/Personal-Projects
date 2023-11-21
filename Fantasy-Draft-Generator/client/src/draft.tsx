//represents a draft
 export type Draft = {
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
export type Pick = {
    //name of the draft pick
    name: string;
  
    //the number they were drafted in
    num: number;
  
    //name of drafter who drafted them
    drafter: string;
  }

/** accepts the JSON of a response from the server. returns undefined if any of the response does not 
 * correspond with a draft type. Otherwise, the draft from the response is returned. */  
export function parseDraft(input: any): undefined | Draft {
    if (typeof input !== "object" || input === null) {
        console.log(1);
        return undefined;
    }
    if (!('id' in input) || typeof input.id !== "string") {
        console.log(3)
        return undefined;
    }
    if (!('start' in input) || typeof input.start !== "boolean") {
        return undefined;
    }
    if (!("rounds" in input) || typeof input.rounds !== "number") {
        return undefined;
    }
    if (!("currRound" in input) || typeof input.currRound !== "number") {
        return undefined;
    }
    if (!("drafters" in input) || !Array.isArray(input.drafters)) {
        return undefined;
    }
    if (!("options" in input) || !Array.isArray(input.options)) {
        return undefined;
    }
    if (!("currPick" in input) || typeof input.currPick !== "string") {
        return undefined;
    }
    if (!("picks" in input) || !Array.isArray(input.picks)) {
        return undefined;
    }
    if (input.picks.length === 0) {
        return {
            id: input.id,
            start: input.start,
            rounds: input.rounds,
            currRound: input.currRound,
            drafters: input.drafters,
            options: input.options,
            currPick: input.drafters[0],
            picks: []
        }
    }
    const currPick = input.picks[0];
    if (typeof currPick !== "object" || currPick === null || currPick === undefined) {
        return undefined;
    }
    if (!("name" in currPick) || typeof currPick.name !== "string") {
        return undefined;
    }
    if (!("num" in currPick) || typeof currPick.num !== "number") {
        return undefined;
    }
    if (!("drafter" in currPick) || typeof currPick.drafter !== "string") {
        return undefined;
    }
    
    const draft: Draft = {
        id: input.id,
        start: input.start,
        rounds: input.rounds, 
        currRound: input.currRound,
        drafters: input.drafters,
        options: input.options,
        currPick: input.currPick,
        picks: input.picks
    }
    return draft;
}


