// ************************************
// *     EJERCICIO 1                   *
// ************************************


// ============== Point =======================

function Point (x, y) {
	this.x = x;
	this.y = y;    
}

// ============== Rectangle ====================
function Rectangle() {}

Rectangle.prototype.init = function(p1,p2) {
	this.px = p1.x;
	this.py = p1.y;
	this.width = p2.x - p1.x;
	this.height = p2.y - p1.y;
	this.lineWidth= 1;
	this.color = 'black';
}

Rectangle.prototype.draw = function() {

	// TU CÓDIGO AQUÍ:
	// pinta un rectángulo del color actual en pantalla en la posición px,py, con
	// la anchura y altura actual y una línea de anchura=lineWidth. Ten en cuenta que 
	// en este ejemplo la variable ctx es global y que guarda el contexto (context) 
	// para pintar en el canvas.


	ctx.beginPath();
	ctx.moveTo(this.px,this.py);
	ctx.lineTo(this.px + this.width,this.py);
	ctx.lineTo(this.px + this.width,this.py + this.height);
	ctx.lineTo(this.px,this.py + this.height);
	ctx.closePath();
	ctx.lineWidth=this.lineWidth;
	ctx.fillStyle = this.color;
	ctx.strokeStyle = 'black';
	ctx.fill();
	ctx.stroke();

}

Rectangle.prototype.draw_preview = function() {

	// TU CÓDIGO AQUÍ:
	// pinta un rectángulo del color actual en pantalla en la posición px,py, con
	// la anchura y altura actual y una línea de anchura=lineWidth. Ten en cuenta que
	// en este ejemplo la variable ctx es global y que guarda el contexto (context)
	// para pintar en el canvas.

	ctxPrevisualizar.beginPath();
	ctxPrevisualizar.moveTo(this.px,this.py);
	ctxPrevisualizar.lineTo(this.px + this.width,this.py);
	ctxPrevisualizar.lineTo(this.px + this.width,this.py + this.height);
	ctxPrevisualizar.lineTo(this.px,this.py + this.height);
	ctxPrevisualizar.closePath();
	ctxPrevisualizar.lineWidth=this.lineWidth;
	ctxPrevisualizar.fillStyle = this.color;
	ctxPrevisualizar.strokeStyle = 'black';
	ctxPrevisualizar.fill();
	ctxPrevisualizar.stroke();

}


Rectangle.prototype.setLineWidth = function(width) { this.lineWidth=width}
Rectangle.prototype.setFill = function(color) { this.color = color}

/** Método introducido en el EJERCICIO 4 */

Rectangle.prototype.move = function(x,y){
	this.px += x;
	this.py += y;
	this.draw();
}

/** Método introducido en el EJERCICIO 4 */

Rectangle.prototype.erase = function(){
	ctx.beginPath();
	ctx.lineWidth = this.lineWidth;
	ctx.strokeStyle = Tetris.BOARD_COLOR;
	ctx.rect(this.px, this.py, this.width, this.height);
	ctx.stroke();
	ctx.fillStyle = Tetris.BOARD_COLOR;
	ctx.fill()

}


// ============== Block ===============================

function Block (pos, color) {

	// TU CÓDIGO AQUÍ: este es el constructor de la clase Block. Recibe dos parámetros, pos y color. Pos = posición de la casilla, por ejemplo, (9,19).
	// color = color que hay que emplear para pintar el bloque.
	// Internamente este método crea dos puntos (empleando las coordenadas del pixel)
	// y llama al método init de la clase Rectangle, pasándole como parámetro,
	// estos dos puntos.
	// Sería interesante que emplearas las constantes Block.BLOCK_SIZE y Block.OUTLINE_WIDTH,
	// para establecer la anchura del bloque y la anchura de la línea, respectivamente.

	this.x = pos.x;
	this.y = pos.y;
	var punto1 = new Point(this.x*Block.BLOCK_SIZE,this.y*Block.BLOCK_SIZE); //Punto arriba izquierda
	var punto2 = new Point((this.x*Block.BLOCK_SIZE) + Block.BLOCK_SIZE ,(this.y*Block.BLOCK_SIZE) + Block.BLOCK_SIZE); //Punto abajo derecha
	this.init(punto1,punto2);
	this.setFill(color);
	this.setLineWidth(Block.OUTLINE_WIDTH);

}

Block.BLOCK_SIZE = 30;
Block.OUTLINE_WIDTH = 2;

// TU CÓDIGO AQUÍ: emplea el patrón de herencia (Block es un Rectangle)

Block.prototype = new Rectangle();
Block.prototype.constructor = Block;

/** Método introducido en el EJERCICIO 4 */

Block.prototype.move = function(dx, dy) {
	this.x += dx;
	this.y += dy;

	Rectangle.prototype.move.call(this, dx * Block.BLOCK_SIZE, dy * Block.BLOCK_SIZE);
}

 /**************************************************
 *	 Código que se da dado para el EJERCICIO 5 *
 ***************************************************/

Block.prototype.can_move = function(board, dx, dy) {
   // TU CÓDIGO AQUÍ: toma como parámetro un increment (dx,dy)
  // e indica si es posible mover el bloque actual si 
 // incrementáramos su posición en ese valor
	var nuevoX = this.x + dx;
	var nuevoY = this.y +dy;
	return board.can_move(nuevoX,nuevoY);
}

// ************************************
// *      EJERCICIO 2                  *
// ************************************

function Shape() {}


Shape.prototype.init = function(coords, color) {

	// TU CÓDIGO AQUÍ: método de inicialización de una Pieza del tablero
	// Toma como parámetros: coords, un array de posiciones de los bloques
	// que forman la Pieza y color, un string que indica el color de los bloques
	// Post-condición: para cada coordenada, crea un bloque de ese color y lo guarda en un bloque-array

	var array=[]
	coords.forEach( function ( coord ) {
		var block = new Block(coord,color);
		array.push(block);
	});
	this.blockArray=array;


	/*8 Atributo introducido en el EJERCICIO 8*/
	this.rotation_dir = 1;
	this.shift_rotation_dir=true;

};

Shape.prototype.draw = function() {

	// TU CÓDIGO AQUÍ: método que debe pintar en pantalla todos los bloques
	// que forman la Pieza
	this.blockArray.forEach( function (bloque){
		bloque.draw();
	});
};

Shape.prototype.draw_preview = function(){
	this.blockArray.forEach( function (bloque){
		bloque.draw_preview();
	});
};

 /**************************************************
 *	 Código que se da dado para el EJERCICIO 5 *
 ***************************************************/

Shape.prototype.can_move = function(board, dx, dy) {
	// TU CÓDIGO AQUÍ: comprobar límites para cada bloque de la pieza
	var puedeMoverse=true;
	this.blockArray.forEach( function (bloque){
		if(!bloque.can_move(board,dx,dy)){ //Si el bloque no se puede mover, asignamos false a la variable puedeMoverse
			puedeMoverse=false;
		}
	});
	return puedeMoverse; //True si se puede mover, false si no se puede mover
};

/* Método introducido en el EJERCICIO 8 */

Shape.prototype.can_rotate = function(board) {

//  TU CÓDIGO AQUÍ: calcula la fórmula de rotación para cada uno de los bloques de
// la pieza. Si alguno de los bloques no se pudiera mover a la nueva posición,
// devolver false. En caso contrario, true.


	//x = center.x -dir*center.y + dir*block.y
	//y = center.y + dir*center.x -dir*block.x
	var center = this.center_block;
	var dir =  this.rotation_dir;
	var posible_rotar = true;
	this.blockArray.forEach(function (block){
		var x = center.x -dir*center.y + dir*block.y
		var y = center.y + dir*center.x -dir*block.x;
		if ( !board.can_move(x,y)){
			posible_rotar=false;
		}
	});
	return posible_rotar;
};

/* Método introducido en el EJERCICIO 8 */

Shape.prototype.rotate = function() {

// TU CÓDIGO AQUÍ: básicamente tienes que aplicar la fórmula de rotación
// (que se muestra en el enunciado de la práctica) a todos los bloques de la pieza 

	var center = this.center_block;
	var dir = this.rotation_dir;

	//Borras los bloques
	this.blockArray.forEach( function (block){
		block.erase();
	});

	//Mover los bloques a la nueva posición
	this.blockArray.forEach(function(block){
		var x = center.x -dir*center.y + dir*block.y
		var y = center.y + dir*center.x -dir*block.x;
		block.move(x-block.x, y-block.y)
	});

  /* Deja este código al final. Por defecto las piezas deben oscilar en su
     movimiento, aunque no siempre es así (de ahí que haya que comprobarlo) */
    if (this.shift_rotation_dir)
            this.rotation_dir *= -1
};

/* Método introducido en el EJERCICIO 4 */

Shape.prototype.move = function(dx, dy) {
   
	for (block of this.blockArray) {
		block.erase();
	}

	for (block of this.blockArray) {
		block.move(dx,dy);
	}
};


// ============= I_Shape ================================
function I_Shape(center) {
	var coords = [new Point(center.x - 2, center.y),
		new Point(center.x - 1, center.y),
		new Point(center.x , center.y),
		new Point(center.x + 1, center.y)];

	Shape.prototype.init.call(this, coords, "blue");

	/* Atributo introducido en el ejercicio 8*/
	this.shift_rotation_dir = true;
	this.center_block = this.blockArray[2];

}

// TU CÓDIGO AQUÍ: La clase I_Shape hereda de la clase Shape
I_Shape.prototype = new Shape();
I_Shape.prototype.constructor = I_Shape;

// =============== J_Shape =============================
function J_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar J_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y),
		new Point(center.x, center.y),
		new Point(center.x+1 , center.y),
		new Point(center.x + 1, center.y+1)];

	Shape.prototype.init.call(this, coords, "orange");

	/* atributo introducido en el EJERCICIO 8 */
	this.shift_rotation_dir = false;
	this.center_block = this.blockArray[1];

}

// TU CÓDIGO AQUÍ: La clase J_Shape hereda de la clase Shape
J_Shape.prototype = new Shape();
J_Shape.prototype.constructor = J_Shape;

// ============ L Shape ===========================
function L_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar L_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x + 1, center.y),
		new Point(center.x, center.y),
		new Point(center.x-1 , center.y),
		new Point(center.x -1, center.y+1)];

	Shape.prototype.init.call(this, coords, "cyan");

	/* atributo introducido en el EJERCICIO 8 */
	this.shift_rotation_dir = false;
	this.center_block = this.blockArray[1];
}

// TU CÓDIGO AQUÍ: La clase L_Shape hereda de la clase Shape
L_Shape.prototype = new Shape();
L_Shape.prototype.constructor = L_Shape;

// ============ O Shape ===========================
function O_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar O_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x -1, center.y),
		new Point(center.x, center.y),
		new Point(center.x , center.y+1),
		new Point(center.x -1, center.y+1)];

	Shape.prototype.init.call(this, coords, "red");

	/* atributo introducido en el EJERCICIO 8 */
	this.center_block = this.blockArray[1];

}

// TU CÓDIGO AQUÍ: La clase O_Shape hereda de la clase Shape
O_Shape.prototype = new Shape();
O_Shape.prototype.constructor = O_Shape;

O_Shape.prototype.can_rotate = function(board){
	return false;
};

// ============ S Shape ===========================
function S_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar S_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x+1, center.y),
		new Point(center.x, center.y),
		new Point(center.x , center.y+1),
		new Point(center.x -1, center.y+1)];

	Shape.prototype.init.call(this, coords, "green");

	/* atributo introducido en el EJERCICIO 8 */
	this.shift_rotation_dir = true;
	this.center_block = this.blockArray[1];

}

// TU CÓDIGO AQUÍ: La clase S_Shape hereda de la clase Shape
S_Shape.prototype = new Shape();
S_Shape.prototype.constructor = S_Shape;

// ============ T Shape ===========================
function T_Shape(center) {

	// TU CÓDIGO AQUÍ: : Para programar T_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x+1, center.y),
		new Point(center.x, center.y),
		new Point(center.x-1 , center.y),
		new Point(center.x, center.y+1)];

	Shape.prototype.init.call(this, coords, "yellow");

	/* atributo introducido en el EJERCICIO 8 */
	this.shift_rotation_dir = false;
	this.center_block = this.blockArray[1];

}

// TU CÓDIGO AQUÍ: La clase T_Shape hereda de la clase Shape
T_Shape.prototype = new Shape();
T_Shape.prototype.constructor = T_Shape;

// ============ Z Shape ===========================
function Z_Shape(center) {

	// TU CÓDIGO AQUÍ: : Para programar Z_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x-1, center.y),
		new Point(center.x, center.y),
		new Point(center.x , center.y+1),
		new Point(center.x+1, center.y+1)];

	Shape.prototype.init.call(this, coords, "magenta");

	/* atributo introducido en el EJERCICIO 8 */
	this.shift_rotation_dir = true;
	this.center_block = this.blockArray[1];
}

// TU CÓDIGO AQUÍ: La clase Z_Shape hereda de la clase Shape
Z_Shape.prototype = new Shape();
Z_Shape.prototype.constructor = Z_Shape;


// ************************************
// *     EJERCICIO 3               *
// ************************************

// ====================== BOARD ================

function Board(width, height) {
	this.width = width;
	this.height = height;
	this.grid = {}; /* 6. Estructura de datos introducida en el EJERCICIO 6 */
	this.lineas=0; //Multiplicador para saber cuantas lineas se han eliminado
}


// Si la pieza nueva puede entrar en el tablero, pintarla y devolver true.
// Si no, devoler false

Board.prototype.draw_shape = function(shape){
	if (shape.can_move(this,0,0)){
		shape.draw();
		return true;
	}
	return false;
}

Board.prototype.draw_preview_shape=function(shape){
	ctxPrevisualizar.clearRect(0, 0, canvas.width, canvas.height)
	shape.draw_preview();
}

 /*****************************
 *	 EJERCICIO 6          *
 *****************************/

Board.prototype.add_shape = function(shape){

	// TU CÓDIGO AQUÍ: meter todos los bloques de la pieza que hemos recibido por parámetro en la estructura de datos grid
	for (block of shape.blockArray) {
		var x= block.x;
		var y= block.y;
		var xy = `${x},${y}`; //x,y
		this.grid[xy]=block;
	}
}

// ****************************
// *     EJERCICIO 5          *
// ****************************

Board.prototype.can_move = function(x,y){

 	// TU CÓDIGO AQUÍ: 
 	// hasta ahora, este método siempre devolvía el valor true. Ahora,
 	// comprueba si la posición que se le pasa como párametro está dentro de los  
	// límites del tablero y en función de ello, devuelve true o false.

	/* EJERCICIO 7 */
	// TU CÓDIGO AQUÍ: código para detectar colisiones. Si la posición x,y está en el diccionario grid, devolver false y true en cualquier otro caso.

	var xy = `${x},${y}`; //x,y
	//La pieza no se sale por la izquierda, por la derecha, por abajo ni ocupa la posición de otra pieza.
	if( x>=0 & x < Tetris.BOARD_WIDTH & 0<=y && y<this.height & !(xy in this.grid)){
		return true;
	}
	else{
		return false;
	}
};

Board.prototype.is_row_complete = function(y){
// TU CÓDIGO AQUÍ: comprueba si la línea que se le pasa como parámetro
// es completa o no (se busca en el grid).
	var lineaCompleta=true;
	for (var x=0; x < this.width; x++){
		var xy = `${x},${y}`;
		if ( !(xy in this.grid)){
			lineaCompleta = false;
		}
	}
	return lineaCompleta;

};

Board.prototype.delete_row = function(y,tetris){
// TU CÓDIGO AQUÍ: Borra del grid y de pantalla todos los bloques de la fila y
	for (var x=0; x < this.width; x++) {
		var xy = `${x},${y}`;
		var block = this.grid[xy];
		block.erase();
		delete this.grid[xy];
	}
	//Aumentamos en uno la cantidad de líneas seguidas borradas
	this.lineas+=1;
}

Board.prototype.move_down_rows = function(y_start){

	// TU CÓDIGO AQUÍ:
	//empezando en la fila y_start y hasta la fila 0
	for(var y=y_start; y >=0; y--){
		// para todas las casillas de esa fila
		for (var x=0; x < this.width; x++) {
			var xy = `${x},${y}`;
			//si la casilla está en el grid  (hay bloque en esa casilla)
			if(xy in this.grid){
				var block = this.grid[xy];
				//borrar el bloque del grid
				delete this.grid[xy];
				//mientras se pueda mover el bloque hacia abajo
				while ( block.can_move(this,0,1)){
					//mover el bloque hacia abajo
					block.erase();
					block.move(0,1);
				}
				//meter el bloque en la nueva posición del grid
				var nuevoX= block.x;
				var nuevoY=block.y;
				var nuevoXY = `${nuevoX},${nuevoY}`;
				this.grid[nuevoXY]=block;
			}
		}
	}

};

Board.prototype.actualizar_puntuacion = function(tetris){
	console.log("LINEAS ELIMINADAS : " + this.lineas);
	console.log(this.score);
	if(this.lineas==1){
		this.score+= 40*this.level;
	}
	else if(this.lineas==2){
		this.score+= 100*this.level;
	}
	else if(this.lineas==3){
		this.score+= 300*this.level;
	}
	else if(this.lineas >=4){
		this.score+= 600*this.level;
	}

	this.comprobarNivel(tetris);
};

Board.prototype.comprobarNivel=function(tetris){
	if(this.score>=500 && this.level ==1){
		this.level=2;
		Tetris.prototype.animate_shape(tetris);
	}
	else if(this.score>=1500 && this.level ==2){
		this.level=3;
		Tetris.prototype.animate_shape(tetris);
	}
	else if(this.score>=5000 && this.level ==3){
		this.level=4;
		Tetris.prototype.animate_shape(tetris);
	}
	else if(this.score>=10000 && this.level ==4){
		this.level=5;
		Tetris.prototype.animate_shape(tetris);
	}

	this.nivelInfo.innerHTML="NIVEL: " + this.level;
	this.puntuacionInfo.innerHTML="PUNTUACIÓN: " + this.score;
}

Board.prototype.remove_complete_rows = function(tetris){

	// TU CÓDIGO AQUÍ:
// Para toda fila y del tablero
//   si la fila y está completa
//      borrar fila y
//      mover hacia abajo las filas superiores (es decir, move_down_rows(y-1) )
	for(var y=0; y<=this.height; y++){
		if(this.is_row_complete(y)){
			this.delete_row(y,tetris);
			tetris.audioLine.play();
			this.move_down_rows(y-1);
			//this.remove_complete_rows;
		}
	}
};

Board.prototype.game_over = function(tetris){
	//Parar musica
	tetris.audioMusica.pause();
	tetris.audioMusica.currentTime=0;

	Tetris.PAUSA=true;
	clearInterval(window.timer);

	añadirRecord(this);
}
function añadirRecord(board){
	//record_X:player_score

	var contRecords=0;
	for (var i = 0; i < localStorage.length; i++) {
		var clave = localStorage.key(i);
		if (clave.startsWith("record_")) {  //Buscamos la cantidad de records
			contRecords++;
		}
	}
	var player = prompt("NUEVO RECORD:" + board.score + "!  INSERTA TU NOMBRE", "Nombre de usuario");
	if(player!=null) {
		if (contRecords < 10) {//Hasta que haya 10 records guardados, lo metemos directamente.
			localStorage.setItem("record_" + contRecords, player + "_" + board.score);
		} else {//Ya hay 10 records guardados, hay que buscar si la puntuación actual supera alguna del ranking
			var indexRecord = 0;
			var maxIndexScore = -1;
			for (var i = 0; i < localStorage.length; i++) {
				var clave = localStorage.key(i);
				if (clave.startsWith("record_")) {  //Buscamos los datos de los records
					var info = localStorage.getItem("record_" + indexRecord);  //Obtenemos el valor del record (usuario_score)
					var user_score = info.split("_")[1]; //Conseguimos el score del usuario
					console.log("Score de " + info.split("_")[0] + ":" + user_score);
					if (board.score > user_score) { //Si el score del jugador actual es mayor que el guardado
						maxIndexScore = indexRecord;
					}
					indexRecord++;
				}
			}
			if (maxIndexScore != -1) { //El jugador actual ha obtenido una puntuación más alta que alguien del ranking
				localStorage.removeItem("record_" + maxIndexScore); //Borramos la puntuación mas alta hasta el momento
				localStorage.setItem("record_" + maxIndexScore, player + "_" + board.score) //Guardamos la nueva puntuación
			}

		}
	}
	window.location.href = "ranking.html";



}




// ==================== Tetris ==========================

function Tetris() {
	this.board = new Board(Tetris.BOARD_WIDTH, Tetris.BOARD_HEIGHT);
}

Tetris.SHAPES = [I_Shape, J_Shape, L_Shape, O_Shape, S_Shape, T_Shape, Z_Shape];
Tetris.DIRECTION = {'Left':[-1, 0], 'Right':[1, 0], 'Down':[0, 1]};
Tetris.BOARD_WIDTH = 10;
Tetris.BOARD_HEIGHT = 20;
Tetris.BOARD_COLOR='white';
Tetris.PAUSA=false;
Tetris.prototype.create_new_shape = function(next_shape){

	// TU CÓDIGO AQUÍ: 
	// Elegir un nombre de pieza al azar del array Tetris.SHAPES
	// Crear una instancia de ese tipo de pieza (x = centro del tablero, y = 0)
	// Devolver la referencia de esa pieza nueva
	if(next_shape == null){ //Al principio de la partida entra aquí
		var max= Tetris.SHAPES.length;
		var indiceAleatorio= Math.floor(Math.random() * Math.floor(max));
		var shape = Tetris.SHAPES[indiceAleatorio]; //Tipo de shape, por ejemplo I_Shape

		// Crear una instancia de ese tipo de pieza (x = centro del tablero, y = 0)
		var shapeAleatorio = new shape( new Point(Tetris.BOARD_WIDTH/2,0)); //Debe recibir un punto central
		// Devolver la referencia de esa pieza nueva
		return shapeAleatorio;
	}
	else{
		var nextShape = new next_shape(new Point(Tetris.BOARD_WIDTH/2,0));
		return nextShape;
	}



}
Tetris.prototype.create_next_shape = function(){

	var max= Tetris.SHAPES.length;
	var indiceAleatorio= Math.floor(Math.random() * Math.floor(max));
	var shape = Tetris.SHAPES[indiceAleatorio];
	return shape;
}

Tetris.prototype.create_new_preview_shape = function(shape){

	var newShape = new shape( new Point(3,0));
	return newShape;

}

Tetris.prototype.init = function(){

	//Cargar los ficheros de audio
	this.audioMusica=null;
	this.audioFall=null;
	this.audioLine=null;
	this.audioRotate=null;
	this.cargarMusica(this);
	this.musicaActiva=false;
	var tetris = this;

	//Botón para reproducir música
	var botonPlayAudio = document.getElementById("playaudio");
	botonPlayAudio.addEventListener('click',function(){
		if(tetris.audioMusica.paused  && !Tetris.PAUSA){
			tetris.audioMusica.play();
			tetris.musicaActiva=true;
		}
		else{
			tetris.musicaActiva=false;
			tetris.audioMusica.pause();
		}
		botonPlayAudio.blur(); //Quitar el foco del botón para que no se pulse al darle a la tecla "espacio".
	});

	this.board.score=0;
	this.board.level=1;

	this.board.puntuacionInfo = document.getElementById("score");
	this.board.puntuacionInfo.innerHTML="PUNTUACIÓN: " + this.board.score;
	this.board.nivelInfo = document.getElementById("level");
	this.board.nivelInfo.innerHTML="NIVEL: " + this.board.level;

	document.getElementById("state").innerHTML="ESTADO: JUGANDO";

	/**************
	 EJERCICIO 4
	 ***************/

	// gestor de teclado
	document.addEventListener('keydown', this.key_pressed.bind(this), false);

	// Obtener una nueva pieza al azar y asignarla como pieza actual 

	this.current_shape = this.create_new_shape(null) //Al principio creamos la primera pieza
	this.next_shape=this.create_next_shape();//El tipo de la siguiente pieza (I_Shape, S_Shape...);
	this.preview_shape=this.create_new_preview_shape(this.next_shape);

	// TU CÓDIGO AQUÍ: 
	// Pintar la pieza actual en el tablero
	// Aclaración: (Board tiene un método para pintar)
	this.board.draw_shape(this.current_shape);
	this.board.draw_preview_shape(this.preview_shape);

	this.animate_shape(this);

}

Tetris.prototype.animate_shape = function(tetris) {
	//Este método debe ejecutarse de forma automática una vez cada segundo para mover la pieza actual hacia abajo (una casilla).

	clearInterval(window.timer);
	console.log("NIVEL actual: " + tetris.board.level);

	if (tetris.board.level == 1) {
		window.timer = setInterval(function () {
			if(!Tetris.PAUSA) {
				tetris.do_move("Down");
				tetris.board.score+=1*tetris.board.level;
				tetris.board.comprobarNivel(tetris);
			}
		}, 1000);
	}
	else if(tetris.board.level ==2){
		window.timer = setInterval(function () {
			if(!Tetris.PAUSA) {
				tetris.do_move("Down");
				tetris.board.score+=1*tetris.board.level;
				tetris.board.comprobarNivel(tetris);
			}
		}, 800);
	}
	else if(tetris.board.level ==3){
		window.timer = setInterval(function () {
			if(!Tetris.PAUSA) {
				tetris.do_move("Down");
				tetris.board.score+=1*tetris.board.level;
				tetris.board.comprobarNivel(tetris);
			}
		}, 600);
	}
	else if(tetris.board.level ==4){
		window.timer = setInterval(function () {
			if(!Tetris.PAUSA) {
				tetris.do_move("Down");
				tetris.board.score+=1*tetris.board.level;
				tetris.board.comprobarNivel(tetris);
			}
		}, 400);
	}
	else if(tetris.board.level ==5){
		window.timer = setInterval(function () {
			if(!Tetris.PAUSA) {
				tetris.do_move("Down");
				tetris.board.score+=1*tetris.board.level;
				tetris.board.comprobarNivel(tetris);
			}
		}, 200);
	}
}


Tetris.prototype.key_pressed = function(e) { 

	var key = e.keyCode ? e.keyCode : e.which;

        // TU CÓDIGO AQUÍ:
	// en la variable key se guardará el código ASCII de la tecla que
	// ha pulsado el usuario. ¿Cuál es el código key que corresponde 
	// a mover la pieza hacia la izquierda, la derecha, abajo o a rotarla?

	/* Introduce el código para realizar la rotación en el EJERCICIO 8. Es decir, al pulsar la flecha arriba, rotar la pieza actual */

	//https://css-tricks.com/snippets/javascript/javascript-keycodes/
	//left arrow: 37
	//up arrow:	38
	//right arrow:	39
	//down arrow:	40

	//Tetris.DIRECTION = {'Left':[-1, 0], 'Right':[1, 0], 'Down':[0, 1]};
	var direccion;
	switch (key) {
		case 37:
			direccion="Left"
			break;
		case 39:
			direccion="Right"
			break;
		case 40:
			direccion="Down"
			break;
		case 38:
			this.do_rotate();
			break;
		case 80:
			this.pausa();
			break;
		// TU CÓDIGO AQUÍ: Añadir una condición para que si el jugador pulsa la tecla "Espacio", la pieza caiga en picado
		case 32:
			var pos = Tetris.DIRECTION["Down"];
			if(!Tetris.PAUSA) {
				this.audioFall.play();
				while (this.current_shape.can_move(this.board, pos[0], pos[1])) { //Mientras la pieza se pueda mover hacia abajo
					this.do_move("Down");//Mover la pieza hasta abajo
				}
				direccion = "Down" //Establecer otra vez la dirección para que vuelva a llamar al método
			}
			break;
	}
	if(direccion != null){
		this.do_move(direccion);
	}

}

Tetris.prototype.pausa = function(){
	//console.log(this.musica)
	if(Tetris.PAUSA){
		console.log("Se ha quitado pausa");
		document.getElementById("state").innerHTML="ESTADO: JUGANDO";
		if(this.musicaActiva){
			this.audioMusica.play();
		}
		Tetris.PAUSA=false;

	}
	else{
		console.log("Se ha puesto en pausa");
		if(this.musicaActiva){
			this.audioMusica.pause();
		}
		document.getElementById("state").innerHTML="ESTADO: EN PAUSA";
		Tetris.PAUSA=true;
	}
}

Tetris.prototype.do_move = function(direction) {

	// TU CÓDIGO AQUÍ: el usuario ha pulsado la tecla Left, Right o Down (izquierda,
	// derecha o abajo). Tenemos que mover la pieza en la dirección correspondiente
	// a esa tecla. Recuerda que el array Tetris.DIRECTION guarda los desplazamientos 
	// en cada dirección, por tanto, si accedes a Tetris.DIRECTION[direction], 
	// obtendrás el desplazamiento (dx, dy). A continuación analiza si la pieza actual 
	// se puede mover con ese desplazamiento. En caso afirmativo, mueve la pieza. 

	if(!Tetris.PAUSA) {
		var nuevaPos = Tetris.DIRECTION[direction];
		var x = nuevaPos[0];
		var y = nuevaPos[1];
		if (this.current_shape.can_move(this.board, x, y)) { //Si la pieza se puede mover, moverlo en la nueva dirección
			this.current_shape.move(x, y);
		}
			/* Código que se pide en el EJERCICIO 6 */
			// else if(direction=='Down')
		// TU CÓDIGO AQUÍ: añade la pieza actual al grid. Crea una nueva pieza y dibújala en el tablero.
		else if (direction === "Down") {
			this.board.add_shape(this.current_shape);

			this.current_shape = this.create_new_shape(this.next_shape);
			this.next_shape = this.create_next_shape();
			this.preview_shape = this.create_new_preview_shape(this.next_shape);

			this.board.remove_complete_rows(this);
			this.board.actualizar_puntuacion(this)
			this.board.lineas = 0;
			if (!this.board.draw_shape(this.current_shape)) {
				this.board.game_over(this);
			} else {
				this.board.draw_preview_shape(this.preview_shape)
			};
		}
	}



}

/***** EJERCICIO 8 ******/
Tetris.prototype.do_rotate = function(){

	// TU CÓDIGO AQUÍ: si la pieza actual se puede rotar, rótala. Recueda que Shape.can_rotate y Shape.rotate ya están programadas.
	if(!Tetris.PAUSA) {
		this.audioRotate.play();
		if (this.current_shape.can_rotate(this.board)) {
			this.current_shape.rotate();
		}
	}
}


Tetris.prototype.cargarMusica = function(tetris){
	loadAudio("audio/Tetris_theme.ogg").then( audio => {
		tetris.audioMusica=audio;
		tetris.audioMusica.loop=true;
		tetris.audioMusica.volume=0.10;
	});
	loadAudio("audio/sounds_block-rotate.mp3").then( audio => {
		tetris.audioRotate=audio;
	});
	loadAudio("audio/fall.wav").then( audio => {
		tetris.audioFall=audio;
	});
	loadAudio("audio/line.wav").then( audio => {
		tetris.audioLine=audio;
	});
}

function loadAudio(ruta){
	return new Promise(resolve => {
		const audio = new Audio(ruta);
		audio.addEventListener('canplay',() => {
			resolve(audio);
		});
	});
}






