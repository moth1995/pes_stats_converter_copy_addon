function CopyToClipboard(text){
	navigator.clipboard.writeText(text)
		.then(() => {
			console.log("Text copied to clipboard");
		})
		.catch((error) => {
			console.error("Error copying text to clipboard:", error);
		});
};

// create button element
function AddButton(){
	const currentUrl = window.location.href;
	var button = document.createElement("button");
	button.style.position = "fixed";
	button.style.bottom = "20px";
	button.style.right = "20px";
	if (currentUrl.includes("sofifa.com")){
		const version = document.querySelector("div.dropdown:nth-child(1) > a:nth-child(1) > span:nth-child(1)").textContent
		if (supportedVersions.includes(version)) {
	
			button.innerHTML = "PES Stats Copy";
		
			// add event listener to button
			button.addEventListener(
				"click", 
				function() {
					console.log("Button clicked");
					// Send a message to the background script to get the string
					var psdString = "";
	
					//const parser = new DOMParser();
					//const doc = parser.parseFromString(document.documentElement.outerHTML, 'text/html');
					outerhtml = document.documentElement.outerHTML 
					chrome.runtime.sendMessage({ message: "getStringSOFIFA", doc: outerhtml }, (response) => {
						console.log(response);
						psdString = response.result;
					
						// Use the string result
						console.log("Received string from background:", psdString);
						CopyToClipboard(psdString);
	
					});
				}
			);
		}
		else {
			button.innerHTML = "FIFA VERSION\nNOT SUPPORTED";
		}
	}
	else if (currentUrl.includes("fminside.net")){
		button.innerHTML = "PES Stats Copy";
		// add event listener to button
		button.addEventListener(
			"click", 
			function() {
				console.log("Button clicked");
				// Send a message to the background script to get the string
				var psdString = "";

				//const parser = new DOMParser();
				//const doc = parser.parseFromString(document.documentElement.outerHTML, 'text/html');
				outerhtml = document.documentElement.outerHTML 
				chrome.runtime.sendMessage({ message: "getStringFMInside", doc: outerhtml }, (response) => {
					console.log(response);
					psdString = response.result;
				
					// Use the string result
					console.log("Received string from background:", psdString);
					CopyToClipboard(psdString);

				});
			}
		);
	}
	// append button to body
	document.body.appendChild(button);
};

supportedVersions = [
	"FIFA 23",
	"FIFA 22",
	"FIFA 21",
	"FIFA 20",
]

AddButton();

