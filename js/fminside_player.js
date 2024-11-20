class FMInsidePlayer{
    constructor(doc){
        this.doc = doc;
        this.GetBasicInfo();
        this.GetStats();
        this.GetRoles();
    }

    GetBasicInfo(){
        this.name = this.doc.querySelector('#player_info #player .title h1').getAttribute('title');
        this.ability = this.doc.querySelector('#ability').textContent;
        this.potential = this.doc.querySelector('#potential').textContent;
        console.log(this.name, this.ability, this.potential);
        const lis = this.doc.querySelector('div#player_info').querySelector('div.column').querySelectorAll("li");
        this.nationality = this.doc.querySelector("span.value:nth-child(1) > a:nth-child(1)").textContent;
        console.log(this.nationality);
        
        var info = {};
        var positionType = [];
        lis.forEach(function(li){
            var key = li.querySelector("span.key").textContent;
            var valueElement = li.querySelector("span.value");
            var value = "";
            if (valueElement.querySelector("span.desktop_positions")){
                value = valueElement.querySelector("span.desktop_positions").textContent;
                valueElement.querySelector("span.desktop_positions").querySelectorAll("span").forEach(span => {
                    console.log(span.getAttribute("title"));
                    positionType.push(span.getAttribute("title"));
                });
            }
            else{
                value = valueElement.textContent;
            }
            info[key] = value;
        })
        this.positionType = positionType;

        this.info = info;

        console.log(this.info);
    }

    StatToObject(){
        var dictionary = {};
        var rows = this.doc.querySelectorAll('table tr');
        rows.forEach(function(row) {
            var acronymElement = row.querySelector('acronym');
          
            var tdElement = row.querySelector('.stat');
            var value = null;
            var key = acronymElement.textContent;
            for (let j = 0; j < tdElement.classList.length; j++) {
                const className = tdElement.classList[j];
                if (className.startsWith('value_')) {
                    value = parseInt(className.split('_')[1], 10);
                    break;
                }
            }
            if (isNaN(value) || value === null || value === undefined) {
                value = 1;
            }

            dictionary[key] = value;
        });
        return dictionary;
    }

    GetStats(){
        this.stats = this.StatToObject();
        console.log(this.stats);
    }

    GetRoles(){
        var roles = {};
        try{
            const rolesLis = this.doc.querySelector('#player > div:nth-child(4)').querySelector('ol').querySelectorAll('li:not(.last)');
            rolesLis.forEach(function(li){
                var key = li.querySelector("span.key").textContent;
                var valueElement = li.querySelector("span.value");
                var value = valueElement.textContent;
                roles[key] = parseFloat(value);
            })    
        }
        catch(err){
            console.log(err);
            console.log("No roles found");
        }
        this.roles = roles;
        console.log(this.roles);
    }

    FromFMPlayer(fmPlayer){
        // Method just added to prevent crash when raw option is selected
    }

    PSDString(){
        let defaultValue = 1;
        return `Name: ${this.info["Name"]}
Nationality: ${this.nationality in pesIndieNationalities ? pesIndieNationalities[this.nationality] : "Free Nationality"}
Age: ${parseInt(this.info["Age"])}
Current Ability: ${this.ability}
Potencial : ${this.potential}
Position: ${FMPositionStringToArray(this.info["Position(s)"])}
Foot: ${this.info["Foot"] == "Left" ? "L" : "R"}

APPEARANCE: 
Height: ${parseInt(this.info["Height"])} cm
Weight: ${parseInt(this.info["Weight"])} kg

Technical Attributes 
Corners ${(typeof this.stats["Corners"] !== "undefined") ? this.stats["Corners"] : defaultValue}
Crossing ${(typeof this.stats["Crossing"] !== "undefined") ? this.stats["Crossing"] : defaultValue}
Dribbling ${(typeof this.stats["Dribbling"] !== "undefined") ? this.stats["Dribbling"] : defaultValue}
Finishing ${(typeof this.stats["Finishing"] !== "undefined") ? this.stats["Finishing"] : defaultValue}
First Touch ${this.stats["First Touch"]}
Free Kick Taking ${this.stats["Free Kick Taking"]}
Heading ${(typeof this.stats["Heading"] !== "undefined") ? this.stats["Heading"] : defaultValue}
Long Shots ${(typeof this.stats["Long Shots"] !== "undefined") ? this.stats["Long Shots"] : defaultValue}
Long Throws ${(typeof this.stats["Long Throws"] !== "undefined") ? this.stats["Long Throws"] : defaultValue}
Marking ${(typeof this.stats["Marking"] !== "undefined") ? this.stats["Marking"] : defaultValue}
Passing ${this.stats["Passing"]}
Penalty Taking ${this.stats["Penalty Taking"]}
Tackling ${(typeof this.stats["Tackling"] !== "undefined") ? this.stats["Tackling"] : defaultValue}
Technique ${this.stats["Technique"]}

Mental Attributes
Aggression ${this.stats["Aggression"]}
Anticipation ${this.stats["Anticipation"]}
Bravery ${this.stats["Bravery"]}
Composure ${this.stats["Composure"]}
Concentration ${this.stats["Concentration"]}
Decisions ${this.stats["Decisions"]}
Determination ${this.stats["Determination"]}
Flair ${this.stats["Flair"]}
Leadership ${this.stats["Leadership"]}
Off the Ball ${this.stats["Off the Ball"]}
Positioning ${this.stats["Positioning"]}
Teamwork ${this.stats["Teamwork"]}
Vision ${this.stats["Vision"]}
Work Rate ${this.stats["Work Rate"]}

Physical Attributes
Acceleration ${this.stats["Acceleration"]}
Agility ${this.stats["Agility"]}
Balance ${this.stats["Balance"]}
Jumping Reach ${this.stats["Jumping Reach"]}
Natural Fitness ${this.stats["Natural Fitness"]}
Pace ${this.stats["Pace"]}
Stamina ${this.stats["Stamina"]}
Strength ${this.stats["Strength"]}

Goalkeeping Attributes
Aerial Reach ${(typeof this.stats["Aerial Reach"] !== "undefined") ? this.stats["Aerial Reach"] : defaultValue}
Command of Area ${(typeof this.stats["Command of Area"] !== "undefined") ? this.stats["Command of Area"] : defaultValue}
Communication ${(typeof this.stats["Communication"] !== "undefined") ? this.stats["Communication"] : defaultValue}
Eccentricity ${(typeof this.stats["Eccentricity"] !== "undefined") ? this.stats["Eccentricity"] : defaultValue}
Handling ${(typeof this.stats["Handling"] !== "undefined") ? this.stats["Handling"] : defaultValue}
Kicking ${(typeof this.stats["Kicking"] !== "undefined") ? this.stats["Kicking"] : defaultValue}
One on Ones ${(typeof this.stats["One on Ones"] !== "undefined") ? this.stats["One on Ones"] : defaultValue}
Punching (Tendency) ${(typeof this.stats["Punching (Tendency)"] !== "undefined") ? this.stats["Punching (Tendency)"] : defaultValue}
Reflexes ${(typeof this.stats["Reflexes"] !== "undefined") ? this.stats["Reflexes"] : defaultValue}
Rushing Out (Tendency) ${(typeof this.stats["Rushing Out (Tendency)"] !== "undefined") ? this.stats["Rushing Out (Tendency)"] : defaultValue}
Throwing ${(typeof this.stats["Throwing"] !== "undefined") ? this.stats["Throwing"] : defaultValue}
`;
    }
    
}

// create button element
function AddButton(){
	const currentUrl = window.location.href;
	var button = document.createElement("button");
	button.style.position = "fixed";
	button.style.bottom = "20px";
	button.style.right = "20px";
    button.innerHTML = "PES Stats Copy";
    // add event listener to button
    button.addEventListener(
        "click", 
        function() {
            console.log("Button clicked");
            
            chrome.storage.local.get(["selectOptionFMInside", "selectCopyMode"], function (result) {
                const selectedOptionFMInside = result.selectOptionFMInside || "pes5";
                const copyMode = result.selectCopyMode || "one";
                console.log(selectedOptionFMInside);
                console.log(copyMode);
                const parser = new DOMParser();
                const doc = parser.parseFromString(document.documentElement.outerHTML, 'text/html');
                var FMPlayer = new FMInsidePlayer(doc);
                // Convert into pes
                var pesPlayer = new PESPlayer();
                if (selectedOptionFMInside==="pes21"){
                    pesPlayer = new PES21Player();
                } else if (selectedOptionFMInside==="pes13") {
                    pesPlayer = new PES13Player();
                } else if (selectedOptionFMInside==="raw") {
                    pesPlayer = FMPlayer;
                }
                // Use the string result
                pesPlayer.FromFMPlayer(FMPlayer);
                if (copyMode == "one"){
                    var psdString = pesPlayer.PSDString();
                    console.log("Received string from background:", psdString);
                    CopyToClipboard(psdString);
                } else if (copyMode == "multiple" && selectedOptionFMInside == "pes5"){
                    let csvString = pesPlayer.CSVString();
                    AddPlayer(csvString);
                    return;
                } else if (copyMode == "multiple" && selectedOptionFMInside == "pes13"){
                    let csvString = pesPlayer.CSVString();
                    AddPlayer13(csvString);
                    return;
                } else if (copyMode == "multiple" && selectedOptionFMInside == "pes21"){
                    let csvString = pesPlayer.CSVString();
                    AddPlayer21(csvString);
                    return;
                } else {
                    console.log("Invalid copy mode");
                    return;
                }
            });
        }
    );
	// append button to body
	document.body.appendChild(button);
};



AddButton();

