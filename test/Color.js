
import Color from '../src/js/Color';

const assert = require('assert');

describe('Color parser', () => {

	it('Parses hex codes of the format #rgb (# optional)', () => {
		// numeric test
		const black = new Color('#000');
		assert.equal(black.getRed(), 0);
		assert.equal(black.getGreen(), 0);
		assert.equal(black.getBlue(), 0);

		// alphabetic test
		const white = new Color('#fff');
		assert.equal(white.getRed(), 255);
		assert.equal(white.getGreen(), 255);
		assert.equal(white.getBlue(), 255);

		// mixed test
		const lime = new Color('#ac3');
		assert.equal(lime.getRed(), 170);
		assert.equal(lime.getGreen(), 204);
		assert.equal(lime.getBlue(), 51);

		// octothorpeless test
		const ice = new Color('7de');
		assert.equal(ice.getRed(), 119);
		assert.equal(ice.getGreen(), 221);
		assert.equal(ice.getBlue(), 238);
	});

	it('Parses hex codes of the format #RGB (# optional)', () => {
		// alphabetic test
		const white = new Color('#FFF');
		assert.equal(white.getRed(), 255);
		assert.equal(white.getGreen(), 255);
		assert.equal(white.getBlue(), 255);

		// mixed test
		const lime = new Color('#AC3');
		assert.equal(lime.getRed(), 170);
		assert.equal(lime.getGreen(), 204);
		assert.equal(lime.getBlue(), 51);

		// octothorpeless test
		const ice = new Color('7DE');
		assert.equal(ice.getRed(), 119);
		assert.equal(ice.getGreen(), 221);
		assert.equal(ice.getBlue(), 238);
	});

	it('Parses hex codes of the format #rrggbb (# optional)', () => {
		// numeric test
		const black = new Color('#000000');
		assert.equal(black.getRed(), 0);
		assert.equal(black.getGreen(), 0);
		assert.equal(black.getBlue(), 0);

		// alphabetic test
		const white = new Color('#ffffff');
		assert.equal(white.getRed(), 255);
		assert.equal(white.getGreen(), 255);
		assert.equal(white.getBlue(), 255);

		// mixed test
		const lime = new Color('#aacc33');
		assert.equal(lime.getRed(), 170);
		assert.equal(lime.getGreen(), 204);
		assert.equal(lime.getBlue(), 51);

		// octothorpeless test
		const orange = new Color('d56b45');
		assert.equal(orange.getRed(), 213);
		assert.equal(orange.getGreen(), 107);
		assert.equal(orange.getBlue(), 69);
	});

	it('Parses hex codes of the format #RRGGBB (# optional)', () => {
		// alphabetic test
		const white = new Color('#FFFFFF');
		assert.equal(white.getRed(), 255);
		assert.equal(white.getGreen(), 255);
		assert.equal(white.getBlue(), 255);

		// mixed test
		const lime = new Color('#AACC33');
		assert.equal(lime.getRed(), 170);
		assert.equal(lime.getGreen(), 204);
		assert.equal(lime.getBlue(), 51);

		// octothorpeless test
		const orange = new Color('D56B45');
		assert.equal(orange.getRed(), 213);
		assert.equal(orange.getGreen(), 107);
		assert.equal(orange.getBlue(), 69);
	});

	it('Accepts an RGB (decimal) object with keys "R", "G", and "B" (uppercase)', () => {
		let red;
		let green;
		let blue;

		let color;

		red = 20;
		green = 255;
		blue = 89;
		color = new Color({'R': red, 'G': green, 'B': blue});
		assert.equal(color.getRed(), red);
		assert.equal(color.getGreen(), green);
		assert.equal(color.getBlue(), blue);

		red = 46;
		green = 0;
		blue = 255;
		color = new Color({'R': red, 'G': green, 'B': blue});
		assert.equal(color.getRed(), red);
		assert.equal(color.getGreen(), green);
		assert.equal(color.getBlue(), blue);
	});

	it('Accepts an RGB (decimal) object with keys "red", "green", and "blue" (lowercase)', () => {
		let red;
		let green;
		let blue;

		let color;

		red = 20;
		green = 255;
		blue = 89;
		color = new Color({'red': red, 'green': green, 'blue': blue});
		assert.equal(color.getRed(), red);
		assert.equal(color.getGreen(), green);
		assert.equal(color.getBlue(), blue);

		red = 46;
		green = 0;
		blue = 255;
		color = new Color({'red': red, 'green': green, 'blue': blue});
		assert.equal(color.getRed(), red);
		assert.equal(color.getGreen(), green);
		assert.equal(color.getBlue(), blue);
	});

});


describe('HSV Conversion', () => {
	// since it's more efficient to do it all at once,
	// i also test all at once
	it('Converts RGB to HSV for HSV getters', () => {
		// expected values from:
		// https://convertingcolors.com/

		const white = new Color({'red': 255, 'green': 255, 'blue': 255});
		assert.equal(white.getHue(), 0);
		assert.equal(white.getSaturation(), 0);
		assert.equal(white.getValue(), 100);

		const black = new Color({'red': 0, 'green': 0, 'blue': 0});
		assert.equal(black.getHue(), 0);
		assert.equal(black.getSaturation(), 0);
		assert.equal(black.getValue(), 0);

		const teal = new Color({'red': 0, 'green': 128, 'blue': 128});
		assert.equal(Math.round(teal.getHue()), 180);
		assert.equal(Math.round(teal.getSaturation()), 100);
		assert.equal(Math.round(teal.getValue()), 50);

		const redorange = new Color({'red': 218, 'green': 6, 'blue': 18});
		assert.equal(Math.round(redorange.getHue()), 357);
		assert.equal(Math.round(redorange.getSaturation()), 97);
		assert.equal(Math.round(redorange.getValue()), 85);

		const navy = new Color('#1A2D86');
		assert.equal(Math.round(navy.getHue()), 229);
		assert.equal(Math.round(navy.getSaturation()), 81);
		assert.equal(Math.round(navy.getValue()), 53);
	});

	it('Determines hue to be 0 for greyscale colors', () => {
		// literally just testing every possible greyscale color
		// honestly this is easy /shrug

		var i;
		const max = 255;

		let color;
		for (i = 0; i < max; i++) {
			color = new Color({'red': i, 'green': i, 'blue': i});
			assert.equal(color.getHue(), 0);
		}
	});

	// HSV parsing in constructor still todo
	// it('If hue was sent to constructor, sends hue', () => {
	// 	// todo
	// });

});



describe('getRelativeLuminance', () => {

	/**
	 * Helper function for assertions
	 *
	 * @param {number} numberToRound
	 * @param {number} placesToRoundTo
	 */
	function roundToPlaces(numberToRound, placesToRoundTo) {
		return (
			parseFloat(numberToRound.toFixed(placesToRoundTo))
		);
	}

	it('Calculates relative luminance of a color', () => {
		const white = new Color({'red': 255, 'green': 255, 'blue': 255});
		assert.equal(white.getRelativeLuminance(), 1);

		const black = new Color({'red': 0, 'green': 0, 'blue': 0});
		assert.equal(black.getRelativeLuminance(), 0);

		// https://planetcalc.com/7778/

		const orange = new Color('#FA7014');
		assert.equal(
			roundToPlaces(orange.getRelativeLuminance() * 100, 2),
			31.96
		);

		const bad = new Color('bad'); // lol it's valid
		assert.equal(
			roundToPlaces(bad.getRelativeLuminance() * 100, 2),
			44.53
		);
	});

});


describe('Output formatting', () => {

	describe('getHexString', () => {

		it('Outputs a hex string of format #RRGGBB', () => {
			const white = new Color('FFF');
			assert.equal(white.getHexString(), '#FFFFFF');

			const coffee = new Color('#c0ffee');
			assert.equal(coffee.getHexString(), '#C0FFEE');

			const purplish = new Color({'red': 160, 'green': 79, 'blue': 230});
			assert.equal(purplish.getHexString(), '#A04FE6');
		});

	});


	describe('getRGBString', () => {

		it('Outputs an RGB string of format RGB(r, g, b)', () => {
			const black = new Color('000');
			assert.equal(black.getRGBString(), 'RGB(0, 0, 0)');

			const white = new Color('#fff');
			assert.equal(white.getRGBString(), 'RGB(255, 255, 255)');

			const coffee = new Color('#c0ffee');
			assert.equal(coffee.getRGBString(), 'RGB(192, 255, 238)');

			const minty = new Color({'red': 20, 'green': 230, 'blue': 180});
			assert.equal(minty.getRGBString(), 'RGB(20, 230, 180)');

			// this is to prove that the keys don't matter
			const brownish = new Color({
				'blue': 16,
				'red': 100,
				'foobar': 'LOL',
				'green': 27,
				'GREEN': 255,
			});
			assert.equal(brownish.getRGBString(), 'RGB(100, 27, 16)');
		});

	});

	describe('getHSVString', () => {

		it('Outputs an HSV string of format HSV(h°, s%, v%)', () => {
			const black = new Color('000');
			assert.equal(black.getHSVString(), 'HSV(0°, 0%, 0%)');

			const white = new Color('#fff');
			assert.equal(white.getHSVString(), 'HSV(0°, 0%, 100%)');

			const coffee = new Color('#c0ffee');
			assert.equal(coffee.getHSVString(), 'HSV(164°, 25%, 100%)');

			const minty = new Color({'red': 20, 'green': 230, 'blue': 180});
			assert.equal(minty.getHSVString(), 'HSV(166°, 91%, 90%)');

			// this is to prove that the keys don't matter
			const brownish = new Color({
				'blue': 16,
				'red': 100,
				'foobar': 'LOL',
				'green': 27,
				'GREEN': 255,
			});
			assert.equal(brownish.getHSVString(), 'HSV(8°, 84%, 39%)');
		});

	});

});


