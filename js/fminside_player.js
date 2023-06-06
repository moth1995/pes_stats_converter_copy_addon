class FMInsidePlayer{
    constructor(doc){
        this.doc = doc;
        this.GetBasicInfo();
        this.GetStats();
    }

    GetBasicInfo(){
        this.name = this.doc.querySelector('#player_info #player .title .meta h1').getAttribute('title');
        const lis = this.doc.querySelector('div#player_info').querySelector('div.column').querySelectorAll("li");
        this.nationality = this.doc.querySelector("span.value:nth-child(1) > a:nth-child(1)").textContent;
        console.log(this.nationality);
        
        var info = {};
        lis.forEach(function(li){
            var key = li.querySelector("span.key").textContent;
            var valueElement = li.querySelector("span.value");
            var value = "";
            if (valueElement.querySelector("span.desktop_positions")){
                value = valueElement.querySelector("span.desktop_positions").textContent;
            }
            else{
                value = valueElement.textContent;
            }
            info[key] = value;
        })

        this.info = info;

        console.log(this.info);
    }

    StatToObject(stat){
        var dictionary = {};
        var rows = this.doc.querySelectorAll('table tr');
        rows.forEach(function(row) {
            // Find the <acronym> element within the row
            var acronymElement = row.querySelector('acronym');
          
            // Find the second <td> element within the row
            var tdElement = row.querySelector('.stat');
          
            // Extract the text value from the <acronym> title
            var key = acronymElement.textContent;
          
            // Extract the content of the second <td>
            var value = parseInt(tdElement.textContent);
            if (isNaN(value) || value === null || value === undefined) {
                value = 1;
            }
            // Add the key-value pair to the dictionary
            dictionary[key] = value;
        });
        return dictionary;
    }

    GetStats(){
        const stats = this.doc.querySelector('div#player_stats.block.stats').querySelectorAll('div.column');
        this.stats = this.StatToObject(stats[0]);
        console.log(this.stats);
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
            // Send a message to the background script to get the string

            const parser = new DOMParser();
            const doc = parser.parseFromString(document.documentElement.outerHTML, 'text/html');
            var FMPlayer = new FMInsidePlayer(doc);
            // Convert into pes
            var pesPlayer = new PESPlayer();
            console.log(pesPlayer.EXP_Value);
            // Use the string result
            var psdString = pesPlayer.FromFMPlayer(FMPlayer);
            console.log("Received string from background:", psdString);
            CopyToClipboard(psdString);

        }
    );
	// append button to body
	document.body.appendChild(button);
};



AddButton();

