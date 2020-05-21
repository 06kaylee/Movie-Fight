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
		onMovieSelect(movie, document.querySelector('#left-summary'));
	},
	//make a copy of everything inside autoCompleteConfig
	...autoCompleteConfig
});

createAutoComplete({
	root: document.querySelector('#right-autocomplete'),
	onOptionSelect(movie) {
		//hide the tutorial messages after user selects a movie
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#right-summary'));
	},
	//make a copy of everything inside autoCompleteConfig
	...autoCompleteConfig
});

const onMovieSelect = async (movie, summaryElement) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: 'c78c56ca',
			i: movie.imdbID
		}
	});
	summaryElement.innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movie) => {
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

        <article class="notification is-primary">
            <p class="title">${movie.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>

        <article class="notification is-primary">
            <p class="title">${movie.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>

        <article class="notification is-primary">
            <p class="title">${movie.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>

        <article class="notification is-primary">
            <p class="title">${movie.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>

        <article class="notification is-primary">
            <p class="title">${movie.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};
