
import Color from './Color.js';
import ColorScheme from './ColorScheme.js';
import Toner from './Toner.js';

class Palette {

	constructor() {
		this.seedHue = this.generateSeedHue();
		this.generateFullPalette();
	}

	static getToneCount () {
		return 9;
	}

	generateSeedHue() {
		return ColorScheme.generateRandomInteger(0, 359);
	}

	generateColorScheme() {
		let rand = ColorScheme.generateRandomInteger(1, 7);

		let colors;
		let paletteType;

		switch (rand) {
		case 1:
			paletteType = 'analogous';
			colors = (ColorScheme
				.generateAnalogous(this.seedHue)
				.getColors()
			);
			break;
		case 2:
			paletteType = 'complementary';
			colors = (ColorScheme
				.generateComplementary(this.seedHue)
				.getColors()
			);
			break;
		case 3:
			paletteType = 'monochromatic';
			colors = (ColorScheme
				.generateMonochromatic(this.seedHue)
				.getColors()
			);
			break;
		case 4:
			paletteType = 'rectangular tetradic';
			colors = (ColorScheme
				.generateRectangularTetradic(this.seedHue)
				.getColors()
			);
			break;
		case 5:
			paletteType = 'split complementary';
			colors = (ColorScheme
				.generateSplitComplementary(this.seedHue)
				.getColors()
			);
			break;
		case 6:
			paletteType = 'square tetradic';
			colors = (ColorScheme
				.generateSquareTetradic(this.seedHue)
				.getColors()
			);
			break;
		case 7:
			paletteType = 'triadic';
			colors = (ColorScheme
				.generateTriadic(this.seedHue)
				.getColors()
			);
			break;
		default:
			// idk how you got here
			throw new Error('Unknown palette generation type');
		}

		// add a strongly neutral color
		colors.push(new Color({
			'hue': colors[0].getHue(),
			'saturation': ColorScheme.generateRandomInteger(2, 8),
			'value': 50,
		}));

		return {
			'colors': colors,
			'paletteType': paletteType,
		};
	}

	generateFullPalette() {
		const colorScheme = this.generateColorScheme();
		this.paletteType = colorScheme.paletteType;

		this.palette = (colorScheme.colors).map((color) => {
			const mainSetHex = color.getHexString();
			const tones = (new Toner(color)).generateSet(Palette.getToneCount());

			return tones.map((toneColor) => {
				return {
					'color': toneColor,
					'main': toneColor.getHexString() === mainSetHex,
				};
			});
		});
	}

	nameColors() {
		// get UNIQUE color names!
	}

	getPalette() {
		return this.palette.map((i) => {
			return i.slice();
		});
	}

	getMainColors() {
		return this.palette.map((colorList) => {
			let i;
			for (i = 0; i < colorList.length; i++) {
				if (colorList[i].main) {
					return colorList[i];
				}
			}
			return null; // how did this happen?
		});
	}

	getPaletteType() {
		return this.paletteType;
	}

}

export default Palette;



