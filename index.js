function deconstructor({words, number, base}) {
	const which = Math.log(number) / Math.log(base) | 0
	const amount = Math.pow(base, which)
	const prefix = number / amount | 0
	const round = amount * prefix
	return {
		number: prefix,
		remainder: number - round,
		word: words[which]
	}
}

function thousands(number) {
	const words = [
		'',
		'thousand',
		'million',
		'billion',
		'trillion',
		'quadrillion',
		'quintillion',
		'bazillion',
		'katrillion'
	]
	return deconstructor({
		words,
		number,
		base: 1000
	})
}

function hundreds(number) {
	const words = ['', 'hundred']
	return deconstructor({
		number,
		words,
		number,
		base: 100
	})
}

function teens(number) {
	const words = [
		'ten',
		'eleven',
		'twelve',
		'thirteen',
		'fourteen',
		'fifteen',
		'sixteen',
		'seventeen',
		'eighteen',
		'nineteen'
	]
	const prefix = number - 10
	return {
		number: '',
		remainder: 0,
		word: words[prefix]
	}
}

function tens(number) {
	const words = [
		'',
		'ten',
		'twenty',
		'thirty',
		'forty',
		'fifty',
		'sixty',
		'seventy',
		'eighty',
		'ninety'
	]
	const prefix = number / 10 | 0
	const round = prefix * 10
	if (prefix == 1) return teens(number)
	return {
		number: '',
		remainder: number - round,
		word: words[prefix]
	}
}

function ones(number) {
	const words = [
			'',
			'one',
			'two',
			'three',
			'four',
			'five',
			'six',
			'seven',
			'eight',
			'nine'
	]
	return {
		number: '',
		remainder: 0,
		word: words[number]
	}
}

const functions = [{
	func: thousands,
	base: 1000
}, {
	func: hundreds,
	base: 100
}, {
	func: tens,
	base: 10
}, {
	func: ones,
	base: 1
}]

function deconstruct(number) {
	return functions.reduce((current, {func, base}) => {
		const numbers = [...current]
		while (number > base - 1) {
			const details = func(number)
			numbers.push(details)
			number = details.remainder
		}
		return numbers
	}, [])
}

function reduce(array) {
	return array.reduce((previous, {number, word}) => {
		return [
			previous,
			number && reduce(deconstruct(number)),
			word
		].filter(Boolean).join(' ')
	 }, '')
}

module.exports = number => {
	let minus = false
	if (isNaN(number)) return 'not a number'
	if (!number) return 'zero'
	number = Number(number)
	if (number < 0) {
		minus = true
		number = Math.abs(number)
	}
	if (!Number.isFinite(number)) return minus ? 'minus infinity' : 'infinity'
	const result = reduce(deconstruct(number)).trim()
	return minus ? `minus ${result}` : result
}
