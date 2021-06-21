var BSCalc = {
	DecodeValue: function(x) {
		if (!x ||x.length == 0) return null;
		var l = "pnumxkMG";
		x = x.replaceAll(/^(\d+)([A-Za-z])(\d+)$/g, '$1.$3$2');
		if (!/([0-9.,-]+){1,}([A-Za-z]+)?/g.test(x)) throw new Error("Invalid input supplied.");
		var m = /([0-9.,-]+){1,}([A-Za-z]+)?/g.exec(x);
		var n = (m[2] || 'x')[0];
		if (m.index != 0 || m[2] !== undefined && m[2].length > 1) throw new Error("Invalid input supplied.");
		n = l.indexOf(n) - 4;
		if (n < -4 || n > 3) throw new Error("Invalid input supplied.");
		var d = parseFloat(m[1].replace(',', '.'));
		if (d === NaN) throw new Error("Invalid input supplied.");
		return d * Math.pow(1000, n);
	},
	
	EncodeValue: function(x) {
		var j = "pnumxkMG";
		var k = 4;
		if (x <= 1) while (x < 1 && k > 0) { x *= 1000; k--; }
		else if (x >= 1000) while (x >= 1000 && k < 7) { x /= 1000; k++; }
		x = Math.round(x * 100) / 100;
		return j[k] == 'x' ? x : x + j[k];
	},
	
	Execute: function (operation, ...args) {
		if (operation == null || operation == undefined) return;
		if (args == null || args == undefined || typeof args !== 'object' || args.length == 0) return;
		if (typeof operation !== 'function') operation = operation[args.splice(0, 1)];
		if (operation == null || operation == undefined) return;
				
		return operation.call(this, ...args);
	},
	
	Expand: function(x) {
		if (typeof x !== 'number') return '0';
		var digits = 3;
		if (x < 0.001) digits += 3;
		if (x < 0.000001) digits += 3;
		if (x < 0.000000001) digits += 3;
		if (x < 0.000000000001) digits += 3;
		return x.toFixed(digits);
	},
	
	Sum: function (arr, op) {
		if (!arr || !op || typeof arr !== 'object' || typeof op !== 'function') return 0;
		var retval = 0;
		for (const elem of arr) if (elem) retval = op.call(null, elem, retval);
		return retval;
	}
};
