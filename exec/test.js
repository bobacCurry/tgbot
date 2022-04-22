// const text = process.argv[2]

// if (/^添加管理(.+)/.test(text)) {
	
// 	const found = text.match(/^添加管理(.+)/)

// 	console.log(found[1])
// }

// ================================


// const rule = /^设置费率(\d+)%$/

// const text = process.argv[2]

// if (rule.test(text)) {
	
// 	const found = text.match(rule)

// 	console.log(found[1])
// }

// ================================


// const rule = /^设置(.+)汇率(\d+\.{0,1}\d*)$/

// const text = process.argv[2]

// if (rule.test(text)) {
	
// 	const found = text.match(rule)

// 	console.log(found[1],Number(found[2]))
// }

// ================================


// const rule = /^下发(\d+\.{0,1}\d*)(.*)$/

// const text = process.argv[2]

// if (rule.test(text)) {
	
// 	const found = text.match(rule)

// 	console.log(Number(found[1]),found[2])
// }

// ================================

const rule = /^入款(-{0,1}\d+\.{0,1}\d*)(.*)$/

const text = process.argv[2]

if (rule.test(text)) {
	
	const found = text.match(rule)

	console.log(Number(found[1]),found[2])
}

// ================================


// const rule = /^\+(\d+\.{0,1}\d*)(.*)$/

// const text = process.argv[2]

// if (rule.test(text)) {
	
// 	const found = text.match(rule)

// 	console.log(Number(found[1]),found[2])
// }

// ================================

// const rule = /^\-(\d+\.{0,1}\d*)(.*)$/

// const text = process.argv[2]

// if (rule.test(text)) {
	
// 	const found = text.match(rule)

// 	console.log(Number(found[1]),found[2])
// }

// ================================