var size;

function onload()
{
	addRow();
}

function addRow()
{

	var t = document.getElementById("t");
	size = t.rows.length;
	var r = t.insertRow(size);
	var c0 = r.insertCell(0);
	var c1 = r.insertCell(1);
	var c2 = r.insertCell(2);

	//var a = document.forms['Form']['Name'].value;
	console.log('me');

	c0.innerHTML = "<div data-tip='[Name]'><input id ='change' type='text' name='Name' value='' onclick='editRows(this)' onkeydown='tabkey(event,this)'></div>";
	c1.innerHTML = "<div data-tip='Grade'><input style='width: 50%' type='text' name='Grade' value='' onclick='editRows(this)''></div>";
	c2.innerHTML = "<div data-tip='Email'><input type='text' name='Email' value='' onclick='editRows(this)'></div>";

}

/*setInterval(function(){
	var t = document.getElementById("t");
	size = t.rows.length;

	var lastRow = t.rows[size-1].Name.value;

	//var a = document.forms['Form']['Name'].value;
	//var a = document.getElementById('change').value;

	if(lastRow!=null){
		addRow();
	}
}, 5000); */

function tabkey(e,place){


	var key = e.keyCode;
	//alert(key);

	if(key == 9){

		//alert('Hi')

		var t = document.getElementById("t");

		lastRow = t.rows.length-1;

		currentRow = place.parentNode.parentNode.parentNode.rowIndex;

		if((currentRow == lastRow) && (t.rows[currentRow-1].cells[0].getElementsByTagName("input")[0].value !="")){

			//alert(t.rows[clickedRow-1].cells[0].getElementsByTagName("input")[0].value);
			addRow();
		}

	}

}

function editRows(clicked){

	//If last input row is not empty, add row; or if no row below add row

	var t = document.getElementById("t");

	lastRow = t.rows.length-1;

	clickedRow = clicked.parentNode.parentNode.parentNode.rowIndex;

	if((clickedRow == lastRow) && (t.rows[clickedRow-1].cells[0].getElementsByTagName("input")[0].value !="")){

		//alert(t.rows[clickedRow-1].cells[0].getElementsByTagName("input")[0].value);
		addRow();
	}

	/*alert(t.rows.length);

  var thing = t.rows[lastRow].cells[0].getElementsByTagName("input")[0].value;
	alert(thing);

	if(thing!=null){

		addRow();
		}

*/

	}




function delRow()
{
	var t = document.getElementById("t");
	size = t.rows.length;
	t.deleteRow(size - 1);
}

function enterKey()
{

if(event.keyCode==13){

	event.keyCode=19

}

}

function changeInputColor(){

	document.getElementsByTagName('input').style.backgroundColor = '#FFFFFF';

}
