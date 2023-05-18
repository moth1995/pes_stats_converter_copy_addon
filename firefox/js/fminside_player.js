class FMInsidePlayer{
    constructor(doc){
        this.doc = doc;
        this.GetBasicInfo();
    }

    GetBasicInfo(){
        this.name = this.doc.querySelector('#player_info #player .title .meta h1').getAttribute('title');
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
            var psdString = FMPlayer.name
            console.log("Received string from background:", psdString);
            CopyToClipboard(psdString);

        }
    );
	// append button to body
	document.body.appendChild(button);
};



AddButton();

