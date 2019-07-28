
import Color from '../src/js/Color';

const assert = require('assert');

describe('Static string parsers', () => {
	// expected values from https://convertingcolors.com/

	describe('hexStringToRGB', () => {

		it('Accepts standard six-digit hex strings', () => {
			assert.deepStrictEqual(
				Color.hexStringToRGB('#000000'),
				{'red': 0, 'green': 0, 'blue': 0}
			);

			assert.deepStrictEqual(
				Color.hexStringToRGB('#ffffff'),
				{'red': 255, 'green': 255, 'blue': 255}
			);

			assert.deepStrictEqual(
				Color.hexStringToRGB('#c0ffee'),
				{'red': 192, 'green': 255, 'blue': 238}
			);

			assert.deepStrictEqual(
				Color.hexStringToRGB('#A274BE'),
				{'red': 162, 'green': 116, 'blue': 190}
			);
		});

		it('Accepts standard three-digit shorthand hex strings', () => {
			assert.deepStrictEqual(
				Color.hexStringToRGB('#fff'),
				{'red': 255, 'green': 255, 'blue': 255}
			);

			assert.deepStrictEqual(
				Color.hexStringToRGB('#000'),
				{'red': 0, 'green': 0, 'blue': 0}
			);

			assert.deepStrictEqual(
				Color.hexStringToRGB('7ea'),
				{'red': 119, 'green': 238, 'blue': 170}
			);
		});

		it('Is not case sensitive', () => {
			assert.deepStrictEqual(
				Color.hexStringToRGB('#fff'),
				Color.hexStringToRGB('#FFF')
			);

			assert.deepStrictEqual(
				Color.hexStringToRGB('#c0ffee'),
				Color.hexStringToRGB('#C0FFEE')
			);

			assert.deepStrictEqual(
				Color.hexStringToRGB('#E23295'),
				Color.hexStringToRGB(('#E23295').toLowerCase())
			);
		});

		it('Is not leading-hash sensitive', () => {
			assert.deepStrictEqual(
				Color.hexStringToRGB('#FFF'),
				Color.hexStringToRGB('FFF')
			);

			assert.deepStrictEqual(
				Color.hexStringToRGB('#000000'),
				Color.hexStringToRGB('000000')
			);

			assert.deepStrictEqual(
				Color.hexStringToRGB('#D4F0AF'),
				Color.hexStringToRGB('D4F0AF')
			);

			assert.deepStrictEqual(
				Color.hexStringToRGB('#eed4a3'),
				Color.hexStringToRGB('eed4a3')
			);
		});

	});

	describe('RGBStringToRGB', () => {

		it('Converts comma-delimited base 10 strings to RGB objects', () => {
			assert.deepStrictEqual(
				Color.RGBStringToRGB('rgb(1, 2, 3)'),
				{'red': 1, 'green': 2, 'blue': 3}
			);

			assert.deepStrictEqual(
				Color.RGBStringToRGB('RGB(44, 55, 66)'),
				{'red': 44, 'green': 55, 'blue': 66}
			);

			assert.deepStrictEqual(
				Color.RGBStringToRGB('77, 88, 99'),
				{'red': 77, 'green': 88, 'blue': 99}
			);
		});

		it('Is not case sensitive', () => {
			assert.deepStrictEqual(
				Color.RGBStringToRGB('rgb(12, 34, 120)'),
				Color.RGBStringToRGB('RGB(12, 34, 120)'),
			);
		});

		it('Is not highly whitespace/separator sensitive', () => {
			assert.deepStrictEqual(
				Color.RGBStringToRGB('rgb(56, 67, 254)'),
				Color.RGBStringToRGB('rgb(56,67,254)'),
			);

			assert.deepStrictEqual(
				Color.RGBStringToRGB('rgb(56, 67, 254)'),
				Color.RGBStringToRGB('rgb(56,67, 254)'),
			);

			assert.deepStrictEqual(
				Color.RGBStringToRGB('rgb(56, 67, 254)'),
				Color.RGBStringToRGB('56,67,254'),
			);

			assert.deepStrictEqual(
				Color.RGBStringToRGB('rgb(56, 67, 254)'),
				Color.RGBStringToRGB('   rgb(56,67,254)'),
			);

			assert.deepStrictEqual(
				Color.RGBStringToRGB('rgb(56, 67, 254)'),
				Color.RGBStringToRGB(' rgb( 56 , 67 , 254 )'),
			);
		});

		it('Does not require "RGB()" wrapper', () => {
			assert.deepStrictEqual(
				Color.RGBStringToRGB('5, 10, 15'),
				Color.RGBStringToRGB('RGB(5, 10, 15)'),
			);
		});

		it('Throws an error upon encountering an invalid wrapper', () => {
			assert.throws(() => {
				Color.RGBStringToRGB('rbg(5, 10, 15)');
			});

			assert.throws(() => {
				Color.RGBStringToRGB('HSV(5, 10, 15)');
			});

			assert.throws(() => {
				Color.RGBStringToRGB('rgba(5, 10, 15)');
			});

			assert.throws(() => {
				Color.RGBStringToRGB('rgb{5, 10, 15}');
			});

			assert.throws(() => {
				Color.RGBStringToRGB('I am a teapot (0, 0, 0)');
			});

			assert.throws(() => {
				Color.RGBStringToRGB('(0, 0, 0) Short and stout');
			});
		});

		it('Does not accept non-integer values', () => {
			assert.throws(() => {
				Color.RGBStringToRGB('0, 0, 10.3')
			});

			assert.throws(() => {
				Color.RGBStringToRGB('234.1, 0, 10')
			});

			assert.throws(() => {
				Color.RGBStringToRGB('20, 20.1, 20')
			});

			assert.throws(() => {
				Color.RGBStringToRGB('rgb(1.1, 1, 1)')
			});

			assert.throws(() => {
				Color.RGBStringToRGB('rgb(1, 1, 1.1)')
			});
		});

		it('Throws an error if any value is out of range', () => {
			assert.throws(() => {
				Color.RGBStringToRGB('rgb(0, 0, 256)')
			});

			// this one throws because it isn't a valid rgb string
			// regardless, negatives are out of range
			assert.throws(() => {
				Color.RGBStringToRGB('rgb(-1, 0, 0)')
			});

			assert.throws(() => {
				Color.RGBStringToRGB('rgb(40000, 12, 45)')
			});
		});

	});

	describe('HSVStringToHSV', () => {
		it('Converts comma-delimited base 10 strings to RGB objects', () => {
			assert.deepStrictEqual(
				Color.HSVStringToHSV('HSV(1, 2, 3)'),
				{'hue': 1, 'saturation': 2, 'value': 3}
			);

			assert.deepStrictEqual(
				Color.HSVStringToHSV('HSV(44, 55, 66)'),
				{'hue': 44, 'saturation': 55, 'value': 66}
			);

			assert.deepStrictEqual(
				Color.HSVStringToHSV('77, 88, 99'),
				{'hue': 77, 'saturation': 88, 'value': 99}
			);

			assert.deepStrictEqual(
				Color.HSVStringToHSV('HSV(0deg, 0%, 0%)'),
				{'hue': 0, 'saturation': 0, 'value': 0}
			);

			assert.deepStrictEqual(
				Color.HSVStringToHSV('HSV(0°, 0%, 0%)'),
				{'hue': 0, 'saturation': 0, 'value': 0}
			);
		});

		it('Is not case sensitive', () => {
			assert.deepStrictEqual(
				Color.HSVStringToHSV('HSV(12, 34, 100)'),
				Color.HSVStringToHSV('hsv(12, 34, 100)'),
			);

			assert.deepStrictEqual(
				Color.HSVStringToHSV('HSV(12°, 34%, 100%)'),
				Color.HSVStringToHSV('hsv(12°, 34%, 100%)'),
			);
		});

		it('Is not highly whitespace/separator sensitive', () => {
			assert.deepStrictEqual(
				Color.HSVStringToHSV('HSV(56, 67, 90)'),
				Color.HSVStringToHSV('HSV(56,67%,90)'),
			);

			assert.deepStrictEqual(
				Color.HSVStringToHSV('HSV(56, 67, 90)'),
				Color.HSVStringToHSV('HSV(56,67 %, 90)'),
			);

			assert.deepStrictEqual(
				Color.HSVStringToHSV('HSV(56, 67, 90)'),
				Color.HSVStringToHSV('56,67,90'),
			);

			assert.deepStrictEqual(
				Color.HSVStringToHSV('HSV(56, 67, 90)'),
				Color.HSVStringToHSV('   HSV(56,67,90)'),
			);

			assert.deepStrictEqual(
				Color.HSVStringToHSV('HSV(56, 67, 90)'),
				Color.HSVStringToHSV(' HSV( 56 , 67  % , 90 )'),
			);
		});

		it('Does not require "HSV()" wrapper', () => {
			assert.deepStrictEqual(
				Color.HSVStringToHSV('5, 10, 15'),
				Color.HSVStringToHSV('HSV(5, 10, 15)'),
			);
		});

		it('Throws an error upon encountering an invalid wrapper', () => {
			assert.throws(() => {
				Color.HSVStringToHSV('hvs(5, 10, 15)');
			});

			assert.throws(() => {
				Color.HSVStringToHSV('rgb(5, 10, 15)');
			});

			assert.throws(() => {
				Color.HSVStringToHSV('hsva(5, 10, 15)');
			});

			assert.throws(() => {
				Color.HSVStringToHSV('HSV{5, 10, 15}');
			});

			assert.throws(() => {
				Color.HSVStringToHSV('I am a teapot (0, 0, 0)');
			});

			assert.throws(() => {
				Color.HSVStringToHSV('(0, 0, 0) Short and stout');
			});
		});

		it('Does not accept non-integer values', () => {
			assert.throws(() => {
				Color.HSVStringToHSV('0, 0, 10.3')
			});

			assert.throws(() => {
				Color.HSVStringToHSV('234.1, 0, 10')
			});

			assert.throws(() => {
				Color.HSVStringToHSV('20, 20.1, 20')
			});

			assert.throws(() => {
				Color.HSVStringToHSV('HSV(1.1, 1, 1)')
			});

			assert.throws(() => {
				Color.HSVStringToHSV('HSV(1, 1, 1.1)')
			});
		});

		it('Throws an error if any value is out of range', () => {
			assert.throws(() => {
				Color.HSVStringToHSV('HSV(0, 0, 120%)')
			});

			// this one throws because it isn't a valid HSV string
			// regardless, negatives are out of range -
			// EXCEPT for hue!
			assert.throws(() => {
				Color.HSVStringToHSV('HSV(0, -1, 0)')
			});

			assert.throws(() => {
				Color.HSVStringToHSV('HSV(0deg, 12, 450)')
			});
		});

		it('Will parse negative hue values and normalize them', () => {
			assert.deepStrictEqual(
				Color.HSVStringToHSV('HSV(-20, 50, 50)'),
				{'hue': 360 - 20, 'saturation': 50, 'value': 50}
			);

			assert.deepStrictEqual(
				Color.HSVStringToHSV('HSV(-320, 50, 50)'),
				{'hue': 360 - 320, 'saturation': 50, 'value': 50}
			);

			assert.deepStrictEqual(
				Color.HSVStringToHSV('HSV(-40000, 50, 50)'),
				{'hue': ((360 - 40000) % 360) + 360, 'saturation': 50, 'value': 50}
			);
		});

		it('Will parse hue values >=360 and normalize them', () => {
			assert.deepStrictEqual(
				Color.HSVStringToHSV('HSV(360, 50, 50)'),
				{'hue': 0, 'saturation': 50, 'value': 50}
			);

			assert.deepStrictEqual(
				Color.HSVStringToHSV('HSV(361, 50, 50)'),
				{'hue': 1, 'saturation': 50, 'value': 50}
			);

			assert.deepStrictEqual(
				Color.HSVStringToHSV('HSV(720, 50, 50)'),
				{'hue': 0, 'saturation': 50, 'value': 50}
			);
		});
	});

});

describe('Static conversions', () => {

	// known values obtained externally
	// https://www.rapidtables.com/convert/color/hsv-to-rgb.html
	// https://convertingcolors.com/

	let knownConversions = [
		{'hue': 0, 'saturation': 0, 'value': 0, 'red': 0, 'green': 0, 'blue': 0}, // Black
		{'hue': 0, 'saturation': 0, 'value': 100, 'red': 255, 'green': 255, 'blue': 255}, // White
		{'hue': 0, 'saturation': 100, 'value': 100, 'red': 255, 'green': 0, 'blue': 0}, // Red
		{'hue': 120, 'saturation': 100, 'value': 100, 'red': 0, 'green': 255, 'blue': 0}, // Lime
		{'hue': 240, 'saturation': 100, 'value': 100, 'red': 0, 'green': 0, 'blue': 255}, // Blue
		{'hue': 60, 'saturation': 100, 'value': 100, 'red': 255, 'green': 255, 'blue': 0}, // Yellow
		{'hue': 180, 'saturation': 100, 'value': 100, 'red': 0, 'green': 255, 'blue': 255}, // Cyan
		{'hue': 300, 'saturation': 100, 'value': 100, 'red': 255, 'green': 0, 'blue': 255}, // Magenta
		{'hue': 0, 'saturation': 0, 'value': 75, 'red': 191, 'green': 191, 'blue': 191}, // Silver
		{'hue': 0, 'saturation': 0, 'value': 50, 'red': 128, 'green': 128, 'blue': 128}, // Gray
		{'hue': 0, 'saturation': 100, 'value': 50, 'red': 128, 'green': 0, 'blue': 0}, // Maroon
		{'hue': 60, 'saturation': 100, 'value': 50, 'red': 128, 'green': 128, 'blue': 0}, // Olive
		{'hue': 120, 'saturation': 100, 'value': 50, 'red': 0, 'green': 128, 'blue': 0}, // Green
		{'hue': 300, 'saturation': 100, 'value': 50, 'red': 128, 'green': 0, 'blue': 128}, // Purple
		{'hue': 180, 'saturation': 100, 'value': 50, 'red': 0, 'green': 128, 'blue': 128}, // Teal
		{'hue': 240, 'saturation': 100, 'value': 50, 'red': 0, 'green': 0, 'blue': 128}, // Navy
	];

	describe('convertRGBtoHSV', () => {

		it('Converts RGB objects to HSV objects', () => {
			knownConversions.forEach((known) => {
				assert.deepStrictEqual(
					{
						'hue': known.hue,
						'saturation': known.saturation,
						'value': known.value,
					},
					Color.convertRGBtoHSV({
						'red': known.red,
						'green': known.green,
						'blue': known.blue,
					})
				);
			});
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

	});

	describe('convertHSVtoRGB', () => {

		it('Converts HSV objects to RGB objects', () => {
			knownConversions.forEach((known) => {
				assert.deepStrictEqual(
					{
						'red': known.red,
						'green': known.green,
						'blue': known.blue,
					},
					Color.convertHSVtoRGB({
						'hue': known.hue,
						'saturation': known.saturation,
						'value': known.value,
					})
				);
			});
		});

	});


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


