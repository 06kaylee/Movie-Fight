const autoCompleteConfig = {
	renderOption(movie) {
		//if there is no poster available, set the source to an empty string
		const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
		return `
            <img src="${imgSrc}"/>
            ${movie.Title} (${movie.Year})
        `;
	},
	inputValue(movie) {
		return movie.Title;
	},
	async fetchData(searchTerm) {
		const response = await axios.get('http://www.omdbapi.com/', {
			params: {
				apikey: 'c78c56ca',
				s: searchTerm
			}
		});

		if (response.data.Error) {
			return [];
		}

		return response.data.Search;
	}
};

createAutoComplete({
	root: document.querySelector('#left-autocomplete'),
	onOptionSelect(movie) {
		//hide the tutorial messages after user selects a movie
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
	},
	//make a copy of everything inside autoCompleteConfig
	...autoCompleteConfig
});

createAutoComplete({
	root: document.querySelector('#right-autocomplete'),
	onOptionSelect(movie) {
		//hide the tutorial messages after user selects a movie
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
	},
	//make a copy of everything inside autoCompleteConfig
	...autoCompleteConfig
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: 'c78c56ca',
			i: movie.imdbID
		}
	});

	summaryElement.innerHTML = movieTemplate(response.data);

	if (side === 'left') {
		leftMovie = response.data;
	}
	else {
		rightMovie = response.data;
	}

	if (leftMovie && rightMovie) {
		runComparison();
	}
};

const runComparison = () => {
	const leftStats = document.querySelectorAll('#left-summary .notification');
	const rightStats = document.querySelectorAll('#right-summary .notification');
	leftStats.forEach((leftStat, index) => {
		const rightStat = rightStats[index];
		const leftValue = parseInt(leftStat.dataset.value);
		const rightValue = parseInt(rightStat.dataset.value);
		if (rightValue > leftValue) {
			leftStat.classList.remove('is-primary');
			leftStat.classList.add('is-warning');
		}
		else {
			rightStat.classList.remove('is-primary');
			rightStat.classList.add('is-warning');
		}
	});
};

const movieTemplate = (movie) => {
	const runtime = parseInt(movie.Runtime);
	const metascore = parseInt(movie.Metascore);
	const imdbRating = parseFloat(movie.imdbRating);
	const imdbVotes = parseInt(movie.imdbVotes.replace(/,/g, ''));
	const awards = movie.Awards.split(' ').reduce((sum, curr) => {
		//get the value of each piece in the awards sentence
		const value = parseInt(curr);
		//if it is a string, return the current sum
		if (isNaN(value)) {
			return sum;
		}
		else {
			//if it is a number, add it to the current sum
			return sum + value;
		}
	}, 0);

	return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movie.Poster}"/>
                </p>
            </figure>

            <div class="media-content">
                <div class="content">
                    <h1>${movie.Title}</h1>
                    <h4>${movie.Genre}</h4>
                    <p>${movie.Plot}</p>
                </div>
            </div>
        </article>

        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movie.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>

        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movie.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>

        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movie.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>

        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movie.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};
