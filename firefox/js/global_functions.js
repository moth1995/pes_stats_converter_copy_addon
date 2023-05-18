function CopyToClipboard(text){
	navigator.clipboard.writeText(text)
		.then(() => {
			console.log("Text copied to clipboard");
		})
		.catch((error) => {
			console.error("Error copying text to clipboard:", error);
		});
};
