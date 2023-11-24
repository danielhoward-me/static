const $ = (id) => document.getElementById(id);

const form = $('valuesForm');

const ciphertext = $('ciphertext');
const rowLength = $('rowLength');
const colours = $('colours');

const output = $('output');

form.addEventListener('submit', (e) => {
	e.preventDefault();

	ciphertext.value = ciphertext.value.replace(/[^A-Z]/g, '');

	const ciphertextValue = ciphertext.value;
	const rowLengthValues = rowLength.value.split(/\s*,\s*/g);
	const colours = $('colours').value.split(/\s*,\s*/g).map((colour) => colour.split(/\s+/g));

	const outSections = [];
	rowLengthValues.forEach((rowLength) => {
		const parts = decodeCiphertext(ciphertextValue, rowLength);
		outSections.push(createOutputSection(rowLength, parts, colours));
	});

	output.innerHTML = '';
	outSections.forEach((section) => output.appendChild(section));
});

function createOutputSection(rowLength, outputArray, colours) {
	const details = document.createElement('details');

	const summary = document.createElement('summary');
	summary.innerText = `Row length: ${rowLength}`;
	details.appendChild(summary);

	const allDecodesContainer = document.createElement('div');
	allDecodesContainer.classList.add('all-decodes');
	details.appendChild(allDecodesContainer);

	const div = document.createElement('div');
	div.classList.add('plain-text');
	div.innerHTML = colourise(outputArray.join('<br/>'), colours);
	allDecodesContainer.appendChild(div);

	const columnOrderContainer = document.createElement('div');
	details.appendChild(columnOrderContainer);

	const columnOrderLabel = document.createElement('label');
	columnOrderLabel.innerText = 'Column order: ';
	columnOrderContainer.appendChild(columnOrderLabel);

	const columnOrderInput = document.createElement('input');
	columnOrderInput.type = 'text';
	columnOrderInput.value = getNumberListOfLength(rowLength).join(',');
	columnOrderContainer.appendChild(columnOrderInput);

	const columnOrderButton = document.createElement('button');
	columnOrderButton.innerText = 'Add';
	columnOrderButton.addEventListener('click', () => {
		const columnOrder = columnOrderInput.value.split(/\s*,\s*/g);
		const columns = convertRowsAndColumns(outputArray);

		const newColumns = [];
		columnOrder.forEach((column) => {
			newColumns.push(columns[column]);
		});
		
		const newOutput = convertRowsAndColumns(newColumns);

		const newPlainText = document.createElement('div');
		newPlainText.classList.add('plain-text');
		newPlainText.innerHTML = colourise(newOutput.join('<br/>'), colours);
		allDecodesContainer.appendChild(newPlainText);
	});
	columnOrderContainer.appendChild(columnOrderButton);

	return details;
}

function colourise(text, colours) {
	let inHTML = false;
	let finalOut = '';
	text.split('').forEach((character) => {
		if (character === '<') inHTML = true;
		if (character === '>') inHTML = false;
		if (!inHTML) {
			colours.forEach(([searchValue, colour]) => {
				if (searchValue.toLowerCase() === character.toLowerCase()) {
					character = `<span style="background-color: ${colour}">${character}</span>`;
				}
			});
		}

		finalOut += character;
	});

	return finalOut;
}

function decodeCiphertext(ciphertext, rowLength) {
	const ciphertextLength = ciphertext.length;
	const columnLength = Math.ceil(ciphertextLength / rowLength);

	const columns = splitStringIntoChunks(ciphertext, columnLength);

	const out = [];
	for (let i = 0; i < columnLength; i++) {
		let column = columns.map((column) => column[i]).join('');
		out.push(column);
	}

	return out;
}

/**
 * Splits a string into chunks of a given size
 * @param {string} input The string to split
 * @param {int} chunkSize The size of each chunk
 * @returns {string[]} The array of chunks
 */
function splitStringIntoChunks(input, chunkSize) {
	let out = [];
	for (let i = 0; i < input.length; i += chunkSize) {
		out.push(input.slice(i, i + chunkSize));
	}

	return out;
}

function getNumberListOfLength(length) {
	const out = [];
	for (let i = 0; i < length; i++) {
		out.push(i.toString());
	}
	return out;
}

function convertRowsAndColumns(rows) {
	const columns = [];
	for (let i = 0; i < rows[0].length; i++) {
		columns.push(rows.map((row) => row[i]).join(''));
	}
	return columns;
}
