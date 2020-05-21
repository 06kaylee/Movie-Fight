const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
	//generate dropdown html
	root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div
`;
	const input = root.querySelector('input');
	const dropdown = root.querySelector('.dropdown');
	const resultsWrapper = root.querySelector('.results');

	const onInput = async (e) => {
		//sends whatever user types to fetchData
		const items = await fetchData(e.target.value);
		if (!items.length) {
			dropdown.classList.remove('is-active');
			return;
		}
		//resets dropdown data
		resultsWrapper.innerHTML = '';
		dropdown.classList.add('is-active');
		//iterate over each item in the data
		for (let item of items) {
			//create an anchor tag for each item
			const option = document.createElement('a');

			option.classList.add('dropdown-item');
			option.innerHTML = renderOption(item);
			option.addEventListener('click', () => {
				dropdown.classList.remove('is-active');
				input.value = inputValue(item);
				onOptionSelect(item);
			});
			//append the item to the results div
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
};
