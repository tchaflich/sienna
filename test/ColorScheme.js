
import Color from '../src/js/Color';
import ColorScheme from '../src/js/ColorScheme';

const assert = require('assert');

describe('ColorScheme class', () => {

	describe('Color comparison (sort)', () => {

		it('Primary sort by hue (asc)', () => {
			// first < second
			assert.equal(
				ColorScheme.compareColors(
					new Color({'hue': 5, 'saturation': 50, 'value': 50}),
					new Color({'hue': 240, 'saturation': 50, 'value': 50})
				),
				-1
			);

			// first > second
			assert.equal(
				ColorScheme.compareColors(
					new Color({'hue': 240, 'saturation': 50, 'value': 50}),
					new Color({'hue': 5, 'saturation': 50, 'value': 50})
				),
				1
			);
		});

		it('Secondary sort by saturation (asc)', () => {
			// first < second
			assert.equal(
				ColorScheme.compareColors(
					new Color({'hue': 180, 'saturation': 40, 'value': 50}),
					new Color({'hue': 180, 'saturation': 80, 'value': 50})
				),
				-1
			);

			// first > second
			assert.equal(
				ColorScheme.compareColors(
					new Color({'hue': 180, 'saturation': 80, 'value': 50}),
					new Color({'hue': 180, 'saturation': 40, 'value': 50})
				),
				1
			);
		});

		it('Tertiary sort by value (asc)', () => {
			// first < second
			assert.equal(
				ColorScheme.compareColors(
					new Color({'hue': 180, 'saturation': 50, 'value': 40}),
					new Color({'hue': 180, 'saturation': 50, 'value': 80})
				),
				-1
			);

			// first > second
			assert.equal(
				ColorScheme.compareColors(
					new Color({'hue': 180, 'saturation': 50, 'value': 80}),
					new Color({'hue': 180, 'saturation': 50, 'value': 40})
				),
				1
			);
		});

		it('Returns 0 for colors of identical HSV values', () => {
			assert.equal(
				ColorScheme.compareColors(
					new Color({'hue': 180, 'saturation': 50, 'value': 50}),
					new Color({'hue': 180, 'saturation': 50, 'value': 50})
				),
				0
			);
		});

	});

	describe('Get relative hue list', () => {
		it('Retrieves a list of angular distances between all hue points', () => {
			const fiveApart = new ColorScheme([
				new Color({'hue': 5, 'saturation': 50, 'value': 50}),
				new Color({'hue': 15, 'saturation': 50, 'value': 50}),
				new Color({'hue': 10, 'saturation': 50, 'value': 50}),
			]);

			assert.deepStrictEqual(
				fiveApart.getRelativeHueList(),
				[
					10, // 5 & 15
					5, // 5 & 10
					5, // 15 & 10
				].sort(ColorScheme.compareNumeric)
			);

			const moreDifferent = new ColorScheme([
				new Color({'hue': 355, 'saturation': 50, 'value': 50}),
				new Color({'hue': 10, 'saturation': 50, 'value': 50}),
				new Color({'hue': 15, 'saturation': 50, 'value': 50}),
			]);

			assert.deepStrictEqual(
				moreDifferent.getRelativeHueList(),
				[
					15, // 355 & 10
					20, // 355 & 15
					5, // 10 & 15
				].sort(ColorScheme.compareNumeric)
			);
		});
	});

	describe('generateMonochromatic', () => {

		it('Generates a ColorScheme with one color', () => {
			const seedHue = 5;

			const generated = ColorScheme.generateMonochromatic(seedHue);

			assert.equal(generated.getColors().length, 1);
		});

		it('The ColorScheme generated has the same hue as the seed color', () => {
			const seedHue = 5;
			const generated = ColorScheme.generateMonochromatic(5);

			assert.equal(
				generated.getColors()[0].getHue(),
				seedHue
			);
		});

	});

	describe('generateAnalogous', () => {
		it('Generates a ColorScheme with 3 colors', () => {
			const seedHue = 5;

			const generated = ColorScheme.generateAnalogous(seedHue);

			assert.equal(generated.getColors().length, 3);
		});
		it('The colors generated are 30 or 60 degrees apart in hue', () => {
			const seedHue = 5;

			const generated = ColorScheme.generateAnalogous(seedHue);

			assert.deepStrictEqual(
				generated.getRelativeHueList(),
				[30, 30, 60]
			);
		});
	});

	describe('generateComplementary', () => {
		it('Generates a ColorScheme with 2 colors', () => {
			const seedHue = 5;

			const generated = ColorScheme.generateComplementary(seedHue);

			assert.equal(generated.getColors().length, 2);
		});
		it('The colors generated are 180 degrees apart in hue', () => {
			const seedHue = 5;

			const generated = ColorScheme.generateComplementary(seedHue);

			assert.deepStrictEqual(
				generated.getRelativeHueList(),
				[180]
			);
		});
	});

	describe('generateSplitComplementary', () => {
		it('Generates a ColorScheme with 3 colors', () => {
			const seedHue = 5;

			const generated = ColorScheme.generateSplitComplementary(seedHue);

			assert.equal(generated.getColors().length, 3);
		});
		it('The colors generated are either 60 or 150 degrees from the other colors in hue', () => {
			const seedHue = 5;

			const generated = ColorScheme.generateSplitComplementary(seedHue);

			assert.deepStrictEqual(
				generated.getRelativeHueList(),
				[60, 150, 150]
			);
		});
	});

	describe('generateTriadic', () => {
		it('Generates a ColorScheme with 3 colors', () => {
			const seedHue = 5;

			const generated = ColorScheme.generateTriadic(seedHue);

			assert.equal(generated.getColors().length, 3);
		});
		it('Each color is exactly 120 degrees in hue from the others', () => {
			const seedHue = 5;

			const generated = ColorScheme.generateTriadic(seedHue);

			assert.deepStrictEqual(
				generated.getRelativeHueList(),
				[120, 120, 120]
			);
		});
	});

	describe('generateSquareTetradic', () => {
		it('Generates a ColorScheme with 4 colors', () => {
			const seedHue = 5;

			const generated = ColorScheme.generateSquareTetradic(seedHue);

			assert.equal(generated.getColors().length, 4);
		});
		it('Each color is either 90 or 180 degrees in hue from the others', () => {
			const seedHue = 5;

			const generated = ColorScheme.generateSquareTetradic(seedHue);

			assert.deepStrictEqual(
				generated.getRelativeHueList(),
				[90, 180, 90, 90, 180, 90].sort(ColorScheme.compareNumeric)
			);
		});
	});

	describe('generateRectangularTetradic', () => {
		it('Generates a ColorScheme with 4 colors', () => {
			const seedHue = 5;

			const generated = ColorScheme.generateRectangularTetradic(seedHue);

			assert.equal(generated.getColors().length, 4);
		});
		it('Each color is either 60, 120, or 180 degrees in hue from the others', () => {
			const seedHue = 5;

			const generated = ColorScheme.generateRectangularTetradic(seedHue);

			assert.deepStrictEqual(
				generated.getRelativeHueList(),
				// [geometry intensifies]
				// i drew this out on a sheet of paper and listed AB, AC, AD ... etc
				[60, 180, 120, 120, 180, 60].sort(ColorScheme.compareNumeric)
			);
		});
	});
});

