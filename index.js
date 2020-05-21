const fetchData = async (searchTerm) => {
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
};

//select the autocomplete div
const root = document.querySelector('.autocomplete');
//generate dropdown html
root.innerHTML = `
    <label><b>Search For a Movie</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div
`;
const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

const onInput = async (e) => {
	//sends whatever user types to fetchData
	const movies = await fetchData(e.target.value);
	if (!movies.length) {
		dropdown.classList.remove('is-active');
		return;
	}
	//resets dropdown data
	resultsWrapper.innerHTML = '';
	dropdown.classList.add('is-active');
	//iterate over each movie in the data
	for (let movie of movies) {
		//create an anchor tag for each movie
		const option = document.createElement('a');
		//if there is no poster available, set the source to an empty string
		const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
		option.classList.add('dropdown-item');
		option.innerHTML = `
            <img src="${imgSrc}"/>
            ${movie.Title}
        `;
		option.addEventListener('click', () => {
			dropdown.classList.remove('is-active');
			input.value = movie.Title;
			onMovieSelect(movie);
		});
		//append the movie to the results div
		resultsWrapper.appendChild(option);
	}
};

//wait 500ms to send request to API
input.addEventListener('input', debounce(onInput, 500));

document.addEventListener('click', (event) => {
	//if the user clicks on anything outside of the dropdown
	if (!root.contains(event.target)) {
		//close the dropdown
		dropdown.classList.remove('is-active');
	}
});

const onMovieSelect = async (movie) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: 'c78c56ca',
			i: movie.imdbID
		}
	});

	document.querySelector('#summary').innerHTML = movieTemplate(response.data);
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
