
import Color from './Color.js';


/**
 * A collection of harmonious hues
 *
 * @class
 */
class Palette {

	/**
	 * A palette is a list of Color objects
	 * The colorList should be the "main line" set of colors,
	 * Shades and tints are generated separately
	 *
	 * @param {Array.<Color>} colorList
	 */
	constructor(colorList) {
		this.colors = [];
		(colorList || []).forEach((c) => {
			this.colors.push(c);
		});
		this.colors.sort(Palette.compareColors);
	}

	// generators

	/**
	 * Monochromatic color scheme:
	 * Entirely one hue, different shades and tones
	 * Minimalist, subtle, understated
	 *
	 * @param {number} seedHue - a hue in degrees [0-360)
	 * @returns {Palette}
	 */
	static generateMonochromatic(seedHue) {
		return new Palette([new Color({
			'hue': seedHue,
			'saturation': Palette.generateRandomInteger(60, 100),
			'value': Palette.generateRandomInteger(60, 85),
		})]);
	}

	/**
	 * Analogous color scheme:
	 * Colors adjacent on the color wheel
	 * (I define this as 30 degrees)
	 * One color is usually brighter / more dominant
	 *
	 * @param {number} seedHue - a hue in degrees [0-360)
	 * @returns {Palette}
	 */
	static generateAnalogous(seedHue) {
		let list = [];

		let i;

		let saturations = Palette.shuffleArray([
			Palette.generateRandomInteger(50, 100),
			Palette.generateRandomInteger(30, 70),
			Palette.generateRandomInteger(30, 70),
		]);

		for (i = 0; i < 3; i++) {
			list.push(new Color({
				'hue': (30 * i) + seedHue,
				'saturation': saturations[i],
				'value': Palette.generateRandomInteger(40, 60),
			}));
		}

		return new Palette(list);
	}

	/**
	 * Complementary scheme:
	 * Two colors, opposite from each other on the color wheel
	 * (180 degrees)
	 * These have a powerful contrast, so muting one is often desirable
	 *
	 * @param {number} seedHue - a hue in degrees [0-360)
	 * @returns {Palette}
	 */
	static generateComplementary(seedHue) {
		return new Palette([
			new Color({
				'hue': seedHue,
				'saturation': Palette.generateRandomInteger(50, 100),
				'value': Palette.generateRandomInteger(30, 70),
			}),
			new Color({
				'hue': seedHue + 180,
				'saturation': Palette.generateRandomInteger(20, 70),
				'value': Palette.generateRandomInteger(30, 70),
			}),
		]);
	}

	/**
	 * Split complementary scheme:
	 * Like complementary, but replace one color with the two colors adjacent to it
	 * So two colors are 60 degrees apart from one another,
	 * And the third color is 150 degrees from both of those
	 *
	 * @param {number} seedHue - a hue in degrees [0-360)
	 * @returns {Palette}
	 */
	static generateSplitComplementary(seedHue) {
		let saturations = Palette.shuffleArray([
			Palette.generateRandomInteger(50, 100),
			Palette.generateRandomInteger(30, 70),
			Palette.generateRandomInteger(30, 70),
		]);

		return new Palette([
			new Color({
				'hue': seedHue,
				'saturation': saturations[0],
				'value': Palette.generateRandomInteger(40, 60),
			}),
			new Color({
				'hue': seedHue + 180 + 30,
				'saturation': saturations[1],
				'value': Palette.generateRandomInteger(40, 60),
			}),
			new Color({
				'hue': seedHue + 180 - 30,
				'saturation': saturations[2],
				'value': Palette.generateRandomInteger(40, 60),
			}),
		]);
	}

	/**
	 * Triadic scheme:
	 * Three hues, equally spaced on the color wheel
	 * (120 degrees apart)
	 * One dominant / two muted is preferred
	 *
	 * @param {number} seedHue - a hue in degrees [0-360)
	 * @returns {Palette}
	 */
	static generateTriadic(seedHue) {
		let saturations = Palette.shuffleArray([
			Palette.generateRandomInteger(50, 100),
			Palette.generateRandomInteger(30, 70),
			Palette.generateRandomInteger(30, 70),
		]);

		return new Palette([
			new Color({
				'hue': seedHue,
				'saturation': saturations[0],
				'value': Palette.generateRandomInteger(40, 60),
			}),
			new Color({
				'hue': seedHue + 120,
				'saturation': saturations[1],
				'value': Palette.generateRandomInteger(40, 60),
			}),
			new Color({
				'hue': seedHue - 120,
				'saturation': saturations[2],
				'value': Palette.generateRandomInteger(40, 60),
			}),
		]);
	}

	/**
	 * Tetradic scheme:
	 * Two complementary schemes... at the same time!
	 * Four colors on the wheel, each one having an opposite
	 * Square tetradic means the colors are exactly equally spaced
	 * (90 degrees apart)
	 * Can easily clash, so muting some is best
	 *
	 * @param {number} seedHue - a hue in degrees [0-360)
	 * @returns {Palette}
	 */
	static generateSquareTetradic(seedHue) {
		let saturations = Palette.shuffleArray([
			Palette.generateRandomInteger(50, 100),
			Palette.generateRandomInteger(50, 70),
			Palette.generateRandomInteger(30, 70),
			Palette.generateRandomInteger(30, 60),
		]);

		return new Palette([
			new Color({
				'hue': seedHue,
				'saturation': saturations[0],
				'value': Palette.generateRandomInteger(40, 60),
			}),
			new Color({
				'hue': seedHue + 90,
				'saturation': saturations[1],
				'value': Palette.generateRandomInteger(40, 60),
			}),
			new Color({
				'hue': seedHue - 90,
				'saturation': saturations[2],
				'value': Palette.generateRandomInteger(40, 60),
			}),
			new Color({
				'hue': seedHue + 180,
				'saturation': saturations[3],
				'value': Palette.generateRandomInteger(40, 60),
			}),
		]);
	}

	/**
	 * Tetradic scheme:
	 * Two complementary schemes... at the same time!
	 * Four colors on the wheel, each one having an opposite
	 * Rectangular tetradic means that the colors are not equally spaced
	 * I generate these as 60 degrees apart to mirror split comp. scheme
	 * Can easily clash, so muting some is best
	 *
	 * @param {number} seedHue - a hue in degrees [0-360)
	 * @returns {Palette}
	 */
	static generateRectangularTetradic(seedHue) {
		let saturations = Palette.shuffleArray([
			Palette.generateRandomInteger(50, 100),
			Palette.generateRandomInteger(50, 70),
			Palette.generateRandomInteger(30, 70),
			Palette.generateRandomInteger(30, 60),
		]);

		return new Palette([
			new Color({
				'hue': seedHue,
				'saturation': saturations[0],
				'value': Palette.generateRandomInteger(40, 60),
			}),
			new Color({
				'hue': seedHue + 180,
				'saturation': saturations[1],
				'value': Palette.generateRandomInteger(40, 60),
			}),
			new Color({
				'hue': seedHue + 60,
				'saturation': saturations[2],
				'value': Palette.generateRandomInteger(40, 60),
			}),
			new Color({
				'hue': seedHue + 60 + 180,
				'saturation': saturations[3],
				'value': Palette.generateRandomInteger(40, 60),
			}),
		]);
	}


	// static helper methods


	/**
	 * Compares two colors for sorting
	 * Mostly to get something to easily compare arrays,
	 * since sorting 2d in a 3d space is hard >:C
	 *
	 * @param {Color} a
	 * @param {Color} b
	 *
	 * @returns {number} - enum -1, 0, 1
	 */
	static compareColors(a, b) {
		return (
			Palette.compareNumeric(a.getHue(), b.getHue()) ||
			Palette.compareNumeric(a.getSaturation(), b.getSaturation()) ||
			Palette.compareNumeric(a.getValue(), b.getValue())
		) || 0;
	}


	/**
	 * Compare two numeric values
	 * Try sorting numbers in JS console to see why I wrote this
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Description
	 *
	 * >:C
	 *
	 * @param {number} a
	 * @param {number} b
	 * @returns {number} - enum -1, 0, 1
	 */
	static compareNumeric(a, b) {
		if (a === b) {
			return 0;
		}

		return a > b ? 1 : -1;
	}


	/**
	 * Calculate the *shortest* angular distance between two angles
	 * Useful for comparing hues
	 *
	 * @param {number} firstAngle - degrees [0-360)
	 * @param {number} secondAngle - degrees [0-360)
	 */
	static getAngularDelta(firstAngle, secondAngle) {
		const diff = Math.abs(firstAngle - secondAngle) % 360;

		return diff > 180 ? 360 - diff : diff;
	}


	/**
	 * Generates a random integer
	 * INCLUSIVE of endpoints
	 *
	 * @param {number} min - Minimum value
	 * @param {number} max - Maximum value
	 */
	static generateRandomInteger(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}


	/**
	 * Fisher-Yates (Knuth) shuffle
	 * Mutates the target array
	 *
	 * @param {Array} array
	 * @returns {Array} - The mutated array
	 */
	static shuffleArray(array) {
		let tmp;
		let j;

		let i;
		const ilen = array.length;

		for (i = ilen - 1; i >= 1; i--) {
			j = Palette.generateRandomInteger(0, i);
			if (i === j) {
				continue;
			}
			tmp = array[i];
			array[i] = array[j];
			array[j] = tmp;
		}

		return array;
	}


	// instance helper methods


	/**
	 * Calculates a list of angular distances of hues
	 * The returned list is sorted numerically
	 * Will contain every combination of angles
	 * This can give you more information about the type of palette,
	 * and can be used for testing
	 *
	 * @returns {Array.<number>}
	 */
	getRelativeHueList() {
		const hues = (this.getColors()).map((c) => {
			return c.getHue();
		});

		let i;
		let j;
		const len = hues.length;

		let list = [];

		for (i = 0; i < len; i++) {
			for (j = i + 1; j < len; j++) {
				list.push(Palette.getAngularDelta(
					hues[i],
					hues[j]
				));
			}
		}

		return list.sort(Palette.compareNumeric);
	}


	getColors() {
		return this.colors;
	}


	addNeutral() {
		// todo lol
	}

}

export default Palette;
