export class SOFIFAPlayer {
	constructor(doc) {
		this.doc = doc;
		this.GetVersion();
		this.GetBasicInfo();
		this.GetStats();
	}

	GetVersion() {
		this.FIFAVersion = this.doc.querySelector("div.dropdown:nth-child(1) > a:nth-child(1) > span:nth-child(1)").textContent
	}

	GetBasicInfo() {
		this.name = this.doc.querySelector("h1.ellipsis").textContent
		const meta = this.doc.querySelector('.meta').lastChild.textContent.trim();
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

		this.nationality = this.doc.querySelector(".meta > a:nth-child(1)").getAttribute('title');

		console.log(this.nationality);

		const spans = this.doc.querySelectorAll('.meta.ellipsis span');
		this.posiciones = Array.from(spans).map(span => span.textContent);
		
		this.posicionReg = this.posiciones[0];

		console.log(this.posicionReg, this.posiciones);

	}

	parseStatsItems(items) {
		const values = [];
		const tooltips = [];
		for (let i = 0; i < items.length; i++) {
			const value = parseInt(items[i].querySelector('span:nth-child(odd)').textContent);
			values.push(value);
			const tooltip = items[i].querySelector('span[role="tooltip"]');
			const textContent = tooltip !== null ? tooltip.textContent : items[i].textContent.split(' ').pop();
			tooltips.push(textContent);
		}
		return Object.fromEntries(tooltips.map((_, i) => [tooltips[i], values[i]]));
	}
	/*
	parseGoalkeeperItems(items) {
		const values = [];
		const keys = [];
		for (let i = 0; i < items.length; i++) {
			const value = parseInt(items[i].querySelector('span').textContent);
			values.push(value);
			const key = items[i].textContent.trim().split(' ').slice(-2).join(' ');
			keys.push(key);
		}
		return Object.fromEntries(keys.map((_, i) => [keys[i], values[i]]));
	}
	*/

	GetStats() {
		const sofifa_stats = this.doc.querySelectorAll('div.card');
		const indexes = [];
		for (let i = 0; i < sofifa_stats.length; i++) {
			const h5Tags = sofifa_stats[i].querySelectorAll('h5');
			for (let j = 0; j < h5Tags.length; j++) {
				indexes.push(h5Tags[j].textContent);
			}
		}
		const attackingItems = sofifa_stats[indexes.indexOf('Attacking')].querySelectorAll('li');
		this.attacking = this.parseStatsItems(attackingItems);
		console.log(this.attacking);

		const skillItems = sofifa_stats[indexes.indexOf('Skill')].querySelectorAll('li');
		this.skill = this.parseStatsItems(skillItems);
		console.log(this.skill);

		const movementItems = sofifa_stats[indexes.indexOf('Movement')].querySelectorAll('li');
		this.movement = this.parseStatsItems(movementItems);
		console.log(this.movement);

		const powerItems = sofifa_stats[indexes.indexOf('Power')].querySelectorAll('li');
		this.power = this.parseStatsItems(powerItems);
		console.log(this.power);

		const mentalityItems = sofifa_stats[indexes.indexOf('Mentality')].querySelectorAll('li');
		this.mentality = this.parseStatsItems(mentalityItems);
		console.log(this.mentality);

		const defendingItems = sofifa_stats[indexes.indexOf('Defending')].querySelectorAll('li');
		this.defending = this.parseStatsItems(defendingItems);
		console.log(this.defending);

		const goalkeeperItems = sofifa_stats[indexes.indexOf('Goalkeeping')].querySelectorAll('li');
		this.goalkeeper = this.parseStatsItems(goalkeeperItems);
		console.log(this.goalkeeper);

		const specialities = sofifa_stats[indexes.indexOf('Player specialities')].querySelectorAll('li');
		this.playerSpecialties = [];
		
		if (specialities && specialities.length !== 0) {
			const lis = specialities;
			this.playerSpecialties = Array.from(specialities, li => li.querySelector('a').textContent.trim().replace('#', ''));
		}
		console.log(this.playerSpecialties); // Output specialities array
		
		this.traits = [];
		
		if (indexes.includes('Traits')) {
			const spans = sofifa_stats[indexes.indexOf('Traits')].querySelectorAll('span');
			if (spans) {
				this.traits = Array.from(spans, span => span.textContent);
			}
		}
		console.log(this.traits); // Output traits array
		
		const profileLi = sofifa_stats[indexes.indexOf('Profile')].querySelectorAll('li');

		this.preferedFoot = profileLi[0].querySelector("label").nextSibling.textContent;
		console.log(this.preferedFoot);

		this.weakFoot = profileLi[1].querySelector("svg").previousSibling.textContent;
		console.log(this.weakFoot);

		this.skillMoves = profileLi[2].querySelector("svg").previousSibling.textContent;
		console.log(this.skillMoves);

		this.internationalRepuration = profileLi[3].querySelector("svg").previousSibling.textContent;
		console.log(this.internationalRepuration);

		this.overall = this.doc.querySelector("div.block-quarter:nth-child(1) > div:nth-child(1) > span:nth-child(1)").textContent;

		console.log(this.overall);

	}
};
