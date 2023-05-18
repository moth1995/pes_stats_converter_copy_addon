import { PESPlayer } from './pes_player.js';
import { SOFIFAPlayer } from './sofifa_player.js';
import { FMInsidePlayer } from './fminside_player.js';
import { attributeValues } from "./nationalities.js";

function GetPSDStringFM(outerhtml){
    const parser = new DOMParser();
    const doc = parser.parseFromString(outerhtml, 'text/html');    
    // Parse the data from sofifa
    var FMPlayer = new FMInsidePlayer(doc);
    // Convert into pes
    var pesPlayer = new PESPlayer();
    //var psdString = pesPlayer.FromFMPlayer(FMPlayer);
    //return psdString;
    return attributeValues;
    return FMPlayer.name;
}


function GetPSDStringFIFA(outerhtml){
    const parser = new DOMParser();
    const doc = parser.parseFromString(outerhtml, 'text/html');    
    // Parse the data from sofifa
    var sofifaPlayer = new SOFIFAPlayer(doc);
    // Convert into pes
    var pesPlayer = new PESPlayer();
    var psdString = pesPlayer.FromFIFAPlayer(sofifaPlayer);
    return psdString;
}

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.message === "getStringSOFIFA") {
            // Call the function and send the response
            const response = GetPSDStringFIFA(request.doc);
            sendResponse({ result: response });
        }
        else if (request.message === "getStringFMInside") {
            // Call the function and send the response
            const response = GetPSDStringFM(request.doc);
            sendResponse({ result: response });

        }
    }
);
