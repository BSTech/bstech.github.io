window._title = null;
window.content = null;
window.desc = null;
window.desc1 = null;
window.desc2 = null;
window.note = null;
window.result = null;
window.outval = null;
window.inputfields = null;
window.inputClone = null;
window.inputxvals = [];
window.inputvals = [];
window.inputs = [];
window.ms = null;

window.currentFunction = null;
window.currentFunctionParams = null;

document.addEventListener("DOMContentLoaded", function(event) {
	window._title = document.getElementById('title');
	window.content = document.getElementById('content');
	window.desc = document.getElementById('desc');
	window.desc1 = document.getElementById('desc1');
	window.desc2 = document.getElementById('desc2');
	window.note = document.getElementById('note');
	window.result = document.getElementById('result');
	window.outval = document.getElementById('out');
	window.inputfields = document.getElementById('ixs');
	window.inputClone = document.getElementById('copyclone');
	
	window.ms = document.querySelectorAll('li[bs-func]');
	for (const m of ms) m.addEventListener('click', x => changeFunction(m.getAttribute('bs-func')));
	
	operation = __hash.indexOf(location.hash.replaceAll(/#+?(\w+)(?:[^\w]+)?/g, '$1'));
	if (operation > 0) changeFunction(__func[operation]);
});

document.addEventListener("keyup", function(event) {
	if ((event.keyCode == 46 && event.ctrlKey) || event.keyCode == 113)
	{
		event.preventDefault();
		for (const input of inputs) input.value = '';
		outval.innerText = "";
		result.innerHTML = "";
	}
});

document.addEventListener("keydown", function(event) {
	if (event.keyCode == 123 || (event.keyCode == 73 && event.ctrlKey && event.shiftKey)) event.preventDefault();
});

function textUpdate()
{
	var vs = [];
	
	outval.innerText = "";
	result.innerHTML = "";
	
	try
	{		
		for (var x = 0; x < inputs.length; x++)
		{
			if (inputs.length <= 1 && !inputs[x].value.length) continue;
			vs[x] = inputs[x].value.split(';').map(x => BSCalc.DecodeValue(x)).filter(x => x !== null);//.filter(x => { if (x) return x[0] || x; });
			if (vs[x].length == 0) vs[x] = null;
			else if (vs[x].length == 1) vs[x] = vs[x][0];
		}

		var nulls = findNulls(vs);
		if (vs.length == 1 || nulls == 1)
		{
			var index = findNullIndex(vs);
			
			outval.innerText = inputvals[index].innerText;
			var post = inputxvals[index].innerText;
			if (post) post = ' ' + post;
			
			var val = BSCalc.Execute(findMatch(index), ...vs.filter(x => x !== null));
			if (val == undefined) return;
			else if (typeof val !== 'object')
			{
				if (isNaN(val)) return;
				
				var p = BSCalc.EncodeValue(val); val = BSCalc.Expand(val);
				result.innerHTML = `<b>${fixValType(post, p)}</b> (${val}${post})`;
				return;
			}
			
			var kmap = Object.keys(val);
			if (kmap.length == 0) return;
			
			for (const k of kmap)
			{
				var p = BSCalc.EncodeValue(val[k].val); val = BSCalc.Expand(val[k].val);
				result.innerHTML += `<b>${k}: ${fixValType(' ' + val[k].unit, p)}</b> (${val[k].val}${val[k].unit})<br>`;
			}
		}
	}
	catch (e) { result.innerHTML = e.message; throw e; }
}

function findNullIndex(array)
{
	if (!array) return -1;
	else if (array.length == 1) return 0;
	var retVal = -1;
	for (var x = 0; x < array.length; x++) if (array[x] == null || array[x].length == 0) if (retVal < 0) retVal = x; else { retVal = -1; break; }
	return retVal;
}

function findNulls(array)
{
	if (!array) return -1;
	var retVal = 0;
	for (var x = 0; x < array.length; x++) if (array[x] == null || array[x].length == 0) retVal++;
	return retVal;
}

function findMatch(x)
{
	return currentFunction[currentFunctionParams[x]];
}

function findValueType(x)
{
	if (x == 'fT') return 'Hz/s';
	switch (x[0])
	{
		case 'V': return 'V';
		case 'I': return 'A';
		case 'R': return '&ohm;';
		case 'C': return 'F';
		case 'L': return 'H';
		case 'X': return '&ohm;';
		case 'f': return 'Hz';
		case 'T': return 's';
		case 'A': return 'x';
	}
	return x;
}

function fixParam(x)
{
	if (x == 'fT') return 'f/T';
	return x;
}

function fixValType(p, x)
{
	if (p == 'Hz/s') { if (typeof x == 'number') return x + p; x = x.split(''); var j = x.splice(-1); x = x.join(''); return `${x}${j}Hz/${j}s`; }
	return x + p.substr(1);
}

function changeFunction(fn)
{
	if (!fn)
	{
		for (const e of content.children) e.style.display = 'none';
		desc.style.display = 'block';
		location.hash = '';
		_title.innerText = 'Specialized Calculator (beta)';
		return;
	}
	
	var __idx = __func.indexOf(fn);
	
	if (__idx >= 0)
	{
		location.hash = __hash[__idx];
		_title.innerText = ms[__idx + 1].innerText + ' - Specialized Calculator (beta)';
	}
	
	for (const e of content.children) e.style.display = 'block';
	desc.style.display = 'none';
	var func = BSOperations;
	fn.split('.').forEach(x => {
		if (!func) return;
		if (!func.hasOwnProperty(x)) func = null;
		func = func[x];
	});
	if (!func) return;
	window.currentFunction = func;
	window.currentFunctionParams = Object.keys(currentFunction);
	window.inputs = [];
	window.inputvals = [];
	window.inputxvals = [];
	
	desc1.style.display = currentFunctionParams.length == 1 ? 'none' : 'block';
	desc2.style.display = currentFunctionParams.length != 1 ? 'none' : 'block';
	
	inputfields.querySelectorAll('div').forEach(x => x.remove());
	for (var x = 0; x < currentFunctionParams.length; x++)
	{
		var input = inputClone.cloneNode(true);
		for (const ch of input.children)
		{
			ch.id = ch.id.replace('%i', x);
			ch.innerHTML = ch.innerHTML.replaceAll('%p', fixParam(currentFunctionParams[x]) + ':').replaceAll('%d', findValueType(currentFunctionParams[x]));
		}
		input.removeAttribute('id');
		input.removeAttribute('style');
		inputfields.insertBefore(input, outval);
		
		window.inputs[x] = input.children[1];
		window.inputvals[x] = input.children[0];
		window.inputxvals[x] = input.children[2];
	}
	outval.innerText = "";
	result.innerHTML = "";
}