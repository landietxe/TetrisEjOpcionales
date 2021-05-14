
window.onload = init();

function init() {
    document.addEventListener('keydown', key_pressed, false);
    var indexRecord=0;
    var records=[];
    for (var i = 0; i < localStorage.length; i++) {
        var clave = localStorage.key(i);
        if (clave.startsWith("record_")) {
            var info = localStorage.getItem("record_" + indexRecord);
            indexRecord++;
            records.push(info);
            console.log(info);
        }
    }
    records.sort(function(a,b){
        return parseInt(b.split("_")[1]) - parseInt(a.split("_")[1]) ;
    });

    var table = document.getElementById("tablaRanking").getElementsByTagName('tbody')[0];;
    for(var i=0; i < records.length;i++){
        var row = table.insertRow(i);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);

        var info = records[i].split("_");;
        var name=info[0];
        var score = info[1];

        cell1.innerHTML = i+1;
        cell2.innerHTML = name;
        cell3.innerHTML = score;
    }


    console.log(records);


}
function comparar ( a, b ){ return a - b; }

function key_pressed(e){

    var key = e.keyCode ? e.keyCode : e.which;

    if((key==13)){
        window.location.href = "tetris.html";
    }
}