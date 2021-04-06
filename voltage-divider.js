const e_series = {
	"e6":6,
	"e12":12,
	"e24":24,
	"e48":48,
	"e96":96,
	"e192":192
}

const values_for_e_series = (series)=>{
	if(!series) {
		console.log("Series does not exists.");
		return null;
	}
	let values = [10000000];
	
	if (series < 48) {
		let base = 24;
		let fac = base/series;
		for(let i = 0; i < series; i++){
			for(let j = 0; j < 6; j++) {
				values.push(Math.round(Math.pow(10 , i*fac/base)*10)*Math.pow(10,j));
			}
		}
	} else {
		let base = 192;
		let fac = base/series;
		for(let i = 0; i < series; i++){
			//console.log(i, series, Math.round(Math.pow(10 , i*fac/base)*round)/round);
			for(let j = 0; j < 6; j++) {
				values.push(Math.round(Math.pow(10 , i*fac/base)*100)*Math.pow(10,j)/10);
			}
		}
	}
	
	values.sort((a,b)=>{
		return a < b ? -1 : 1;
	});
	//console.log(values);
	return values;

}

const calculator = (inV, outV, values, series)=>{
	let calced = []
	values.forEach(r1 => {
		values.forEach(r2 => {
			let out = inV*r2/(r1+r2);
			let err = 1-Math.min(out, outV)/Math.max(out, outV);
			if (err < 0.2/Math.log(series))
				calced.push({
					"out":out, "r1":r1, "r2":r2, "err":err*100
				});
		});
	});
	calced.sort((a,b)=>{
		val1 = Math.abs(outV - a.out);
		val2 = Math.abs(outV - b.out);
		if (val1 < val2) return -1;
		else if (val1 > val2) return 1;
		else return 0;
	});
	console.log(calced.length,calced.slice(0,20));
	return calced.slice(0,10);
}

const generateTableHead = (table)=>{
	  let thead = table.createTHead();
	  let row = thead.insertRow();
	  let data = ["Output / V", "R1 / Ohms", "R2 / Ohms", "Error / %"];
	  for (let key of data) {
		let th = document.createElement("th");
		let text = document.createTextNode(key);
		th.appendChild(text);
		row.appendChild(th);
	  }
	
}

const generateTable = (table, data)=>{
	for (let element of data) {
	  let row = table.insertRow();
	  for (key in element) {
		let cell = row.insertCell();
		let text = document.createTextNode(Math.round(element[key]*100)/100);
		cell.appendChild(text);
	  }
	}
  }

const volt_div = ()=>{
	let inVolt = parseInt(document.getElementById("inVolt").value);
	let outVolt = parseInt(document.getElementById("outVolt").value);
	let series = document.getElementById("state").value;
	console.log(inVolt, outVolt, series);
	if (inVolt && outVolt && series && inVolt > outVolt) {


		let values = values_for_e_series(e_series[series]);
		let new_values = calculator(inVolt, outVolt, values, e_series[series]);

		let table = document.querySelector("table");
		while(table.hasChildNodes()){
			table.removeChild(table.firstChild);
		}

		generateTableHead(table);
		generateTable(table, new_values);

	}
}
