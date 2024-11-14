class SOFIFAPlayer {
	constructor(doc) {
		this.doc = doc;
		this.GetVersion();
		this.GetBasicInfo();
		this.GetStats();
	}

	GetVersion() {
		//this.FIFAVersion = this.doc.querySelector("div.dropdown:nth-child(1) > a:nth-child(1) > span:nth-child(1)").textContent;
		// Obtén el elemento select por su nombre
		var selectElement = document.getElementsByName("version")[0];

		// Encuentra el índice del elemento con el atributo "selected"
		var selectedIndex = Array.from(selectElement.options).findIndex(option => option.selected);

		// Obtén el elemento <option> seleccionado
		var selectedOption = selectElement.options[selectedIndex];

		this.FIFAVersion = selectedOption.text;

	}

	GetBasicInfo() {
		this.name = this.doc.querySelector("h1.ellipsis").textContent;
		console.log(this.name);
		const meta = this.doc.querySelector('div.profile.clearfix > p').lastChild.textContent.trim();
		// Regular expressions to match the data
		const ageRegex = /\d+/;
		const birthdayRegex = /\(.*?\)/;
		const heightRegex = /\d+cm/;
		const weightRegex = /\d+kg/;

		// Extract the data using the regular expressions
		this.age = parseInt(meta.match(ageRegex)[0]);
		const birthday = meta.match(birthdayRegex)[0].slice(1, -1);
		const height = meta.match(heightRegex)[0];
		this.weight = parseInt(meta.match(weightRegex)[0]);

		// Parse the extracted data
		this.birthdayDate = new Date(birthday);
		this.height = parseInt(height.match(/\d+/)[0]);

		// Output the parsed data
		console.log(`Age: ${this.age}`);
		console.log(`Birthday: ${this.birthdayDate.toDateString()}`);
		console.log(`Height: ${this.height}cm`);
		console.log(`Weight: ${this.weight}kg`);

		this.nationality = this.doc.querySelector("div.profile.clearfix > p > a").getAttribute('title');

		console.log(this.nationality);

		const spans = this.doc.querySelectorAll('div.profile.clearfix > p > span');
		this.posiciones = Array.from(spans).map(span => span.textContent);
		
		this.posicionReg = this.posiciones[0];

		console.log(this.posicionReg, this.posiciones);

	}

	parseStatsItems(items) {
		const values = [];
		const tooltips = [];
		//console.log("items to be iterated: " + items.length);
		for (let i = 0; i < items.length; i++) {
			const value = parseInt(items[i].querySelector('em').textContent);
			values.push(value);
			//console.log(value);
			const tooltip = items[i].querySelector('span[data-tippy-content]');
			const textContent = tooltip !== null ? tooltip.textContent : items[i].textContent.split(' ').pop();
			//console.log(textContent);
			tooltips.push(textContent);
		}
		return Object.fromEntries(tooltips.map((_, i) => [tooltips[i], values[i]]));
	}

	GetStats() {
		const sofifa_stats = this.doc.querySelectorAll('div.col');
		//console.log(sofifa_stats.length);
		//const indexes = [];
		const indexes = new Array(sofifa_stats.length).fill('');
		for (let i = 0; i < sofifa_stats.length; i++) {
			const h5Tags = sofifa_stats[i].querySelectorAll('h5');
			//console.log(h5Tags.length);
			for (let j = 0; j < h5Tags.length; j++) {
				indexes[i] = h5Tags[j].textContent;
			}
		}
		const attackingItems = sofifa_stats[indexes.indexOf('Attacking')].querySelectorAll('p');
		this.attacking = this.parseStatsItems(attackingItems);
		console.log(this.attacking);

		const skillItems = sofifa_stats[indexes.indexOf('Skill')].querySelectorAll('p');
		this.skill = this.parseStatsItems(skillItems);
		console.log(this.skill);

		const movementItems = sofifa_stats[indexes.indexOf('Movement')].querySelectorAll('p');
		this.movement = this.parseStatsItems(movementItems);
		console.log(this.movement);

		const powerItems = sofifa_stats[indexes.indexOf('Power')].querySelectorAll('p');
		this.power = this.parseStatsItems(powerItems);
		console.log(this.power);

		const mentalityItems = sofifa_stats[indexes.indexOf('Mentality')].querySelectorAll('p');
		this.mentality = this.parseStatsItems(mentalityItems);
		console.log(this.mentality);

		const defendingItems = sofifa_stats[indexes.indexOf('Defending')].querySelectorAll('p');
		this.defending = this.parseStatsItems(defendingItems);
		console.log(this.defending);

		const goalkeeperItems = sofifa_stats[indexes.indexOf('Goalkeeping')].querySelectorAll('p');
		this.goalkeeping = this.parseStatsItems(goalkeeperItems);
		console.log(this.goalkeeping);

		const specialities = sofifa_stats[indexes.indexOf('Player specialities')].querySelectorAll('p');
		this.playerSpecialties = [];
		
		if (specialities && specialities.length !== 0) {
			const lis = specialities;
			this.playerSpecialties = Array.from(specialities, li => li.querySelector('a').textContent.trim().replace('#', ''));
		}
		console.log(this.playerSpecialties); // Output specialities array
		
		this.traits = [];
		let traits_name = this.FIFAVersion == "FC 24" ? 'PlayStyles' : 'Traits';
		if (indexes.includes(traits_name)) {

			const spans = sofifa_stats[indexes.indexOf(traits_name)].querySelectorAll('span');
			if (spans) {
				this.traits = Array.from(spans, span => span.textContent);
			}
		}
		console.log(this.traits); // Output traits array
		
		const profileLi = sofifa_stats[indexes.indexOf('Profile')].querySelectorAll('p');

		this.preferedFoot = profileLi[0].querySelector("label").nextSibling.textContent.trim();
		console.log("preferedFoot: " + this.preferedFoot);

		this.weakFoot = parseInt(profileLi[2].querySelector("svg").previousSibling.textContent);
		console.log("weakFoot: " + this.weakFoot);

		this.skillMoves = parseInt(profileLi[1].querySelector("svg").previousSibling.textContent);
		console.log("skillMoves: " + this.skillMoves);

		this.internationalReputation = parseInt(profileLi[3].querySelector("svg").previousSibling.textContent);
		console.log("internationalReputation: " + this.internationalReputation);

		this.overall = parseInt(this.doc.querySelector("div.attribute > p:nth-child(2) > em").textContent);

		console.log("overall: " + this.overall);

	}
};

// create button element
function AddButton(){
	const currentUrl = window.location.href;
	var button = document.createElement("button");
	button.style.position = "fixed";
	button.style.bottom = "20px";
	button.style.right = "20px";
	//const version = document.querySelector("#body > header:nth-child(1) > section:nth-child(2) > p:nth-child(3) > select:nth-child(1)").textContent;
	
	// Obtén el elemento select por su nombre
	var selectElement = document.getElementsByName("version")[0];

	// Encuentra el índice del elemento con el atributo "selected"
	var selectedIndex = Array.from(selectElement.options).findIndex(option => option.selected);

	// Obtén el elemento <option> seleccionado
	var selectedOption = selectElement.options[selectedIndex];

	const version = selectedOption.text;

	//const language = document.querySelector("details.dropdown.dropdown-br:nth-child(2) > summary > img").getAttribute('title');
	const language = document.querySelectorAll("details.dropdown.dropdown-br")[1].querySelector("summary > img").getAttribute('title');

	console.log(version, language);
	if (supportedVersions.includes(version) && language == "United States") {
		button.innerHTML = "PES Stats Copy";
		// add event listener to button
		button.addEventListener(
			"click", 
			function() {
				console.log("Button clicked");
				// Send a message to the background script to get the string
				chrome.storage.local.get(["selectOptionFMInside", "selectCopyMode"], function (result) {
					const selectedOptionFMInside = result.selectOptionFMInside || "pes5";
					const copyMode = result.selectCopyMode || "one";
					console.log(selectedOptionFMInside);
					console.log(copyMode);

                    if (selectedOptionFMInside != "pes5"){
                        console.log("Only PES5 supported for this website");
						return;
                    }

					const parser = new DOMParser();
					const doc = parser.parseFromString(document.documentElement.outerHTML, 'text/html');
					var sofifaPlayer = new SOFIFAPlayer(doc);
					// Convert into pes
					var pesPlayer = new PESPlayer();
					pesPlayer.FromFIFA17To23Player(sofifaPlayer);
							
					if (copyMode == "one"){
						var psdString = pesPlayer.PSDString();
						console.log("Received string from background:", psdString);
						CopyToClipboard(psdString);
					} else if (copyMode == "multiple" && selectedOptionFMInside == "pes5"){
						let csvString = pesPlayer.CSVString();
						AddPlayer(csvString);
						return;
					} else {
						console.log("Invalid copy mode");
						return;
					}
		
				});
			}
		);
	}
	else if (language != "United States"){
		button.innerHTML = "Please Select English Language";
	}
	else {
		button.innerHTML = "FIFA VERSION NOT SUPPORTED";
	}
	// append button to body
	document.body.appendChild(button);
};

supportedVersions = [
	"FC 25",
	"FC 24",
	"FC 24 DEMO",
	"FIFA 23",
	"FIFA 22",
	"FIFA 21",
	"FIFA 20",
	"FIFA 19",
	"FIFA 18",
	"FIFA 17",
];

AddButton();

