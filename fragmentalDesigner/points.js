/**
 * @typedef {int[]} Point
 */

/**
 * Returns a random coordinate within the shape defined by the verticies
 * @param  {...Point} verticies The verticies of the shape
 * @returns {Point} The random point
 */
function getRandomPointInShape(...verticies) {
	const bounds = getBoundPoints(verticies);

	let pointIsValid = false;
	while (!pointIsValid) {
		const randomPoint = getRandomPointInRect(
			bounds.min,
			bounds.max[0] - bounds.min[0],
			bounds.max[1] - bounds.min[1],
		);
	}

	return [x, y];
}

/**
 * @typedef {Object} BoundValues
 * @property {Point} min The minimum x and y values
 * @property {Point} max The maximum x and y values
 */
/**
 * Gets the min and max x and y values as two points
 * @param {int[][]} points The points
 * @returns {BoundValues} The min and max points
 */
function getBoundPoints(points) {
	const min = [Infinity, Infinity];
	const max = [-Infinity, -Infinity];

	points.forEach((point) => {
		if (point[0] < min[0]) min[0] = point[0];
		if (point[1] < min[1]) min[1] = point[1];

		if (point[0] > max[0]) max[0] = point[0];
		if (point[1] > max[1]) max[1] = point[1];
	});

	return {min, max};
}

/**
 * Returns a random point within the defined rectangle
 * @param {Point} location The top left corner of the rectangle
 * @param {int} width The width of the rectangle
 * @param {int} height The height of the rectangle
 */
function getRandomPointInRect(location, width, height) {

}
