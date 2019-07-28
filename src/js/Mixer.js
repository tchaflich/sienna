
import Color from './Color.js';

class Mixer {

	constructor(colorList) {
		this.colorList = colorList;
	}

	// HSV clusters

	getHueCluster() {
		return this.colorList.map((color) => {
			return color.getHue();
		}).sort();
	}

	getSaturationCluster() {
		return this.colorList.map((color) => {
			return color.getSaturation();
		}).sort();
	}

	getValueCluster() {
		return this.colorList.map((color) => {
			return color.getValue();
		}).sort();
	}

	// RGB clusters

	getRedCluster() {
		return this.colorList.map((color) => {
			return color.getRed();
		}).sort();
	}

	getGreenCluster() {
		return this.colorList.map((color) => {
			return color.getGreen();
		}).sort();
	}

	getBlueCluster() {
		return this.colorList.map((color) => {
			return color.getBlue();
		}).sort();
	}

	// helpers


	evaluateCluster(cluster) {
		let summary = {
			'mean': null,
			'variance': null,
			'standardDeviation': null,
			'minimum': null,
			'maximum': null,
			'count': null,
			'sum': null,
		};

		if (!cluster) {
			throw new Error('Expected array to evaluate');
		}

		summary.count = cluster.length;

		var min = null;
		var max = null;
		var sum = 0;

		cluster.forEach((i) => {
			if (isNaN(i)) {
				throw new Error('Expecting number');
			}

			if (min === null || i < min) {
				min = i;
			}
			if (max === null || i > max) {
				max = i;
			}

			sum += i;
		});

		summary.sum = sum;
		summary.mean = (sum / summary.count);

		// have to do it again to get the variance/stddev
		// we didn't have the mean the first time

		var variance = 0;
		cluster.forEach((i) => {
			variance += Math.pow((i - summary.mean), 2);
		});

		summary.variance = (variance / (summary.count - 1));
		summary.standardDeviation = Math.pow(summary.variance, 0.5);

		return summary;
	}

	shuffleArray(array) {
		var i;
		let ilen = array.length;

		let j;
		let tmp; // i am not doing the interview question thing sorry
		for (i = ilen - 1; i >= 1; i--) {
			j = this.generateRandomInteger(0, i);
			tmp = array[i];
			array[i] = array[j];
			array[j] = tmp;
		}

		return array;
	}

	generateRandomInteger(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static clamp(x, min, max) { // todo
		return Math.max(Math.min(x, max), min);
	}

	// generators

	generateHSVColor() {
		const hueCluster = this.getHueCluster();
		const saturationCluster = this.getSaturationCluster();
		const valueCluster = this.getValueCluster();

		// hues are weird in that they are circular;
		// 360 is added to get "translated" values,
		// then they are re-normalized at the end
		const hueSummary = this.evaluateCluster(hueCluster.map((h) => {
			return h + 360;
		}));
		const saturationSummary = this.evaluateCluster(saturationCluster);
		const valueSummary = this.evaluateCluster(valueCluster);

		var generatePiece = (summary) => {
			return (
				summary.mean +
				this.generateRandomInteger(
					-1 * summary.standardDeviation,
					+1 * summary.standardDeviation
				)
			);
		};

		return {
			'hue': Color.getNormalizedHue(generatePiece(hueSummary)),
			'saturation': Mixer.clamp(generatePiece(saturationSummary), 0, 100),
			'value': Mixer.clamp(generatePiece(valueSummary), 0, 100),
		};
	}

	generateRGBColor() {
		const redCluster = this.getRedCluster();
		const greenCluster = this.getGreenCluster();
		const blueCluster = this.getBlueCluster();

		const redSummary = this.evaluateCluster(redCluster);
		const greenSummary = this.evaluateCluster(greenCluster);
		const blueSummary = this.evaluateCluster(blueCluster);

		let generatePiece = (summary) => {
			return (
				summary.mean +
				this.generateRandomInteger(
					-1 * summary.standardDeviation,
					+1 * summary.standardDeviation
				)
			);
		};

		return {
			'red': Mixer.clamp(generatePiece(redSummary), 0, 255),
			'green': Mixer.clamp(generatePiece(greenSummary), 0, 255),
			'blue': Mixer.clamp(generatePiece(blueSummary), 0, 255),
		};
	}

	// HSL transformations

	// adjustHue(color, newHue) {
	// 	return new Color({
	// 		'hue': Color.getNormalizedHue(newHue),
	// 		'saturation': color.getSaturation(),
	// 		'value': color.getValue(),
	// 	});
	// }

	// adjustSaturation(color, newSaturation) {
	// 	return new Color({
	// 		'hue': color.getHue(),
	// 		'saturation': Mixer.clamp(newSaturation, 0, 100),
	// 		'value': color.getValue(),
	// 	});
	// }

	// adjustValue(color, newValue) {
	// 	return new Color({
	// 		'hue': color.getHue(),
	// 		'saturation': color.getSaturation(),
	// 		'value': Mixer.clamp(newValue, 0, 100),
	// 	});
	// }

}

export default Mixer;

