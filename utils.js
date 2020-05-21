const debounce = (func, delay = 1000) => {
	let timeoutId;
	return (...args) => {
		//if timeout exists, clear it with the timeout id
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			func.apply(null, args);
		}, delay);
	};
};
