WebGL = {
	context : null,
	size : {width:0 , height:0},
	shaderProgram : null,
	positions : null,
	u_MvpMatrix : null,
	u_NormalMatrix : null,
	u_LightColor : null,
	u_LightPosition : null,
	u_AmbientLight : null,
	u_Color : null,

	end : 'end'
}
/*****************************************************************************************************
 *		Base
 *****************************************************************************************************/
WebGL.Base = Class.create();
WebGL.Base.prototype = {
	initialize : function(){
		WebGL.context.uniform4f(WebGL.u_Color, 1.0, 0.0, 0.0, 1.0);
	},
	draw : function(vectors,index){
		this.initArrayBuffer('a_Position', new Float32Array(vectors), WebGL.context.FLOAT, 3);
		this.initArrayBuffer('a_Normal', new Float32Array(vectors), WebGL.context.FLOAT, 3);
		WebGL.context.bindBuffer(WebGL.context.ARRAY_BUFFER, null);
		var indexBuffer = WebGL.context.createBuffer();
		if (!indexBuffer) {
			throw 'error 5';
		}
		WebGL.context.bindBuffer(WebGL.context.ELEMENT_ARRAY_BUFFER, indexBuffer);
		WebGL.context.bufferData(WebGL.context.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), WebGL.context.STATIC_DRAW);
		WebGL.Matrix.setModeMatrix();
		WebGL.context.drawElements(WebGL.context.TRIANGLES, index.length, WebGL.context.UNSIGNED_SHORT, 0);
//		WebGL.context.drawElements(WebGL.context.LINE_LOOP, index.length, WebGL.context.UNSIGNED_SHORT, 0);
	},
	initArrayBuffer : function(attribute, data, type, num){
		var buffer = WebGL.context.createBuffer();
		if (!buffer) {
			throw 'error 3';
		}
		WebGL.context.bindBuffer(WebGL.context.ARRAY_BUFFER, buffer);
		WebGL.context.bufferData(WebGL.context.ARRAY_BUFFER, data, WebGL.context.STATIC_DRAW);
		var a_attribute = WebGL.context.getAttribLocation(WebGL.shaderProgram, attribute);
		if (a_attribute < 0) {
			throw attribute + ' error 4';
		}
		WebGL.context.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
		WebGL.context.enableVertexAttribArray(a_attribute);
		return true;
	},
	get_vectors : function(vecs,fase){
		var buffer = [];
		for(var i=0;i<this.fase.length;i++){
			for(var j=0;j<this.fase[i].length;j++){
				buffer = buffer.concat(vecs[this.fase[i][j]]);
			}
		}
		return buffer;
	}
}
/*****************************************************************************************************
 *		Cube
 *****************************************************************************************************/
WebGL.Cube = Class.create();
Object.extend(WebGL.Cube.prototype,WebGL.Base.prototype);
Object.extend(WebGL.Cube.prototype,{
	initialize : function(){
		this.box_vectros = [
		    [ 0.0 , 0.0 , 0.0],
		    [ 1.0 , 0.0 , 0.0],
		    [ 1.0 , 1.0 , 0.0],
		    [ 0.0 , 1.0 , 0.0],
		    [ 0.0 , 0.0 , 1.0],
		    [ 1.0 , 0.0 , 1.0],
		    [ 1.0 , 1.0 , 1.0],
		    [ 0.0 , 1.0 , 1.0]
		];
		this.fase = [
		    [ 0 , 1 , 2 , 3],
		    [ 1 , 5 , 6 , 2],
		    [ 5 , 4 , 7 , 6],
		    [ 4 , 0 , 3 , 7],
		    [ 4 , 5 , 1 , 0],
		    [ 3 , 2 , 6 , 7]
		];
		this.index = [
		    0,1,2,		0,2,3,
		    4,5,6,		4,6,7,
		    8,9,10,		8,10,11,
		    12,13,14,	12,14,15,
		    16,17,18,	16,18,19,
		    20,21,22,	20,22,23
		];
	},
	Cube_draw : function(){
		WebGL.context.uniform4f(WebGL.u_Color, 0.0, 0.0, 1.0, 1.0);
		WebGL.Matrix.push();
		WebGL.Matrix.translate([0.0, 0.0, -1.0]);
		var vectors = this.get_vectors(this.box_vectros,this.fase);
		this.draw(vectors,this.index);
		WebGL.Matrix.pop();
	}
});
/*****************************************************************************************************
 *		Ball
 *****************************************************************************************************/
WebGL.Ball = Class.create();
Object.extend(WebGL.Ball.prototype,WebGL.Base.prototype);
Object.extend(WebGL.Ball.prototype,{
	initialize : function(){
		var SPHERE_DIV = 20;
		var i, ai, si, ci;
		var j, aj, sj, cj;
		var p1, p2;
		this.positions = [];
		this.indices = [];
		for (j = 0; j <= SPHERE_DIV; j++) {
			aj = j * Math.PI / SPHERE_DIV;
			sj = Math.sin(aj);
			cj = Math.cos(aj);
			for (i = 0; i <= SPHERE_DIV; i++) {
				ai = i * 2 * Math.PI / SPHERE_DIV;
				si = Math.sin(ai);
				ci = Math.cos(ai);

				this.positions.push(si * sj);  // X
				this.positions.push(cj);       // Y
				this.positions.push(ci * sj);  // Z
			}
		}
		for (j = 0; j < SPHERE_DIV; j++) {
			for (i = 0; i < SPHERE_DIV; i++) {
				p1 = j * (SPHERE_DIV+1) + i;
				p2 = p1 + (SPHERE_DIV+1);
				this.indices.push(p1);
				this.indices.push(p2);
				this.indices.push(p1 + 1);
				this.indices.push(p1 + 1);
				this.indices.push(p2);
				this.indices.push(p2 + 1);
			}
		}
	},
	Ball_draw : function(){
		WebGL.context.uniform4f(WebGL.u_Color, 0.0, 1.0, 1.0, 1.0);
		WebGL.Matrix.push();
		WebGL.Matrix.translate([-1.0, 1.0, 0.0]);
		WebGL.Matrix.scale([0.4,0.4,0.4]);
		this.draw(this.positions,this.indices);
		WebGL.Matrix.pop();
	}
});
/*****************************************************************************************************
 *		Torus
 *****************************************************************************************************/
WebGL.Torus = Class.create();
Object.extend(WebGL.Torus.prototype,WebGL.Base.prototype);
Object.extend(WebGL.Torus.prototype,{
	initialize : function(){
		var SPHERE_DIV = 20;
		var i, j, k;
		var x , y , z;
		var s, t , p1 , p2;
		points = [];
		this.positions = [];
		this.indexs = [];
		var twopi = 2 * Math.PI;
		var ent_size = 1.0 / SPHERE_DIV;
		for (i = 0; i <= SPHERE_DIV; i++) {
			points[i] = [];
			for (j = 0; j <= SPHERE_DIV; j++) {
				s = i % SPHERE_DIV;
				t = j % SPHERE_DIV;
				x = (0.6 + 0.2 * Math.cos(s * twopi / SPHERE_DIV)) * Math.cos(t * twopi / SPHERE_DIV);
				y = (0.6 + 0.2 * Math.cos(s * twopi / SPHERE_DIV)) * Math.sin(t * twopi / SPHERE_DIV);
				z = 0.2 * Math.sin(s * twopi / SPHERE_DIV);
				points[i].push([x , y , z]);
			}
		}
		for (i = 0; i < SPHERE_DIV; i++) {
			for (j = 0; j < SPHERE_DIV; j++) {
				this.positions = this.positions.concat(points[i][j]);
				this.positions = this.positions.concat(points[i+1][j]);
				this.positions = this.positions.concat(points[i+1][j+1]);
				this.positions = this.positions.concat(points[i][j+1]);
			}
		}
		var left_top = 0;
		for (i = 0; i < SPHERE_DIV; i++) {
			for (j = 0; j < SPHERE_DIV; j++) {
				this.indexs.push(left_top);
				this.indexs.push(left_top+1);
				this.indexs.push(left_top+2);
				this.indexs.push(left_top);
				this.indexs.push(left_top+2);
				this.indexs.push(left_top+3);
				left_top += 4;
			}
		}
	},
	Torus_draw : function(){
		WebGL.context.uniform4f(WebGL.u_Color, 0.0, 1.0, 0.0, 1.0);
		WebGL.Matrix.push();
		WebGL.Matrix.translate([0.0, 0.0, 1.0]);
		this.draw(this.positions,this.indexs);
		WebGL.Matrix.pop();
	}
});
/*****************************************************************************************************
 *		Torus
 *****************************************************************************************************/
WebGL.Cylinder = Class.create();
Object.extend(WebGL.Cylinder.prototype,WebGL.Base.prototype);
Object.extend(WebGL.Cylinder.prototype,{
	initialize : function(){
		var SPHERE_DIV = 20;
		var points = [[],[]];
		this.positions = [];
		this.indexs = [];
		var x , y , z , s;
		for(i=0;i<=SPHERE_DIV;i++){
			s = i % SPHERE_DIV;
    		angle = Math.PI * 2 / SPHERE_DIV * s;
    		x = Math.cos(angle);
    		z = Math.sin(angle);
    		points[0].push([x,1.0,z]);
    		points[1].push([x,-1.0,z]);
		}
		for (i = 0; i < 1; i++) {
			for (j = 0; j < SPHERE_DIV; j++) {
				this.positions = this.positions.concat(points[i][j]);
				this.positions = this.positions.concat(points[i+1][j]);
				this.positions = this.positions.concat(points[i+1][j+1]);
				this.positions = this.positions.concat(points[i][j+1]);
			}
		}
		var left_top = 0;
		for (i = 0; i < 1; i++) {
			for (j = 0; j < SPHERE_DIV; j++) {
				this.indexs.push(left_top);
				this.indexs.push(left_top+1);
				this.indexs.push(left_top+2);
				this.indexs.push(left_top);
				this.indexs.push(left_top+2);
				this.indexs.push(left_top+3);
				left_top += 4;
			}
		}
	},
	Cylinder_draw : function(){
		WebGL.context.uniform4f(WebGL.u_Color, 1.0, 1.0, 0.0, 1.0);
		WebGL.Matrix.push();
		WebGL.Matrix.translate([0.0, -1.0, -1.0]);
		WebGL.Matrix.scale([0.4,0.4,0.4]);
		WebGL.Matrix.rotate(90, [1.0,0.0,0.0]);
		this.draw(this.positions,this.indexs);
		WebGL.Matrix.pop();
	}
});
/*****************************************************************************************************
 *		Matrix
 *****************************************************************************************************/
WebGL.Matrix = {
	init : function(){
		this.modelMatrix = new Matrix4();
		this.mvpMatrix = new Matrix4();
		this.normalMatrix = new Matrix4();
		this.MatrixStack = [];
	},
	loadIdentity_mode : function(){
		this.modelMatrix.setIdentity();
	},
	loadIdentity_view : function(){
		this.mvpMatrix.setIdentity();
		this.normalMatrix.setIdentity();
	},
	push : function(){
		this.MatrixStack.push(this.modelMatrix);
		this.modelMatrix = new Matrix4(this.modelMatrix);
	},
	pop : function(){
		this.modelMatrix = this.MatrixStack.pop();
	},
	setTranslate : function(vector){
		this.modelMatrix.setTranslate(vector[0], vector[1], vector[2]);
		return this.modelMatrix;
	},
	translate : function(vector){
		this.modelMatrix.translate(vector[0], vector[1], vector[2]);
		return this.modelMatrix;
	},
	setRotate : function(angle,vector){
		this.modelMatrix.setRotate(angle, vector[0], vector[1], vector[2]);
		return this.modelMatrix;
	},
	rotate : function(angle,vector){
		this.modelMatrix.rotate(angle, vector[0], vector[1], vector[2]);
		return this.modelMatrix;
	},
	setScale : function(vector){
		this.modelMatrix.setScale(vector[0], vector[1], vector[2]);
		return this.modelMatrix;
	},
	scale : function(vector){
		this.modelMatrix.scale(vector[0], vector[1], vector[2]);
		return this.modelMatrix;
	},
	perspective : function(fovy, aspect, znear, zfar){
		this.mvpMatrix.setPerspective(fovy, aspect, znear, zfar);
	},
	setLookAt : function(ex, ey, ez, cx, cy, cz, ux, uy, uz){
		this.mvpMatrix.lookAt(ex, ey, ez, cx, cy, cz, ux, uy, uz);
	},
	setModeMatrix : function(){
		WebGL.context.uniformMatrix4fv(WebGL.u_ModelMatrix, false, this.modelMatrix.elements);
	},
	setMatrixUniforms : function(){
		WebGL.context.uniformMatrix4fv(WebGL.u_MvpMatrix, false, this.mvpMatrix.elements);
		this.normalMatrix.setInverseOf(this.modelMatrix);
		this.normalMatrix.transpose();
		WebGL.context.uniformMatrix4fv(WebGL.u_NormalMatrix, false, this.normalMatrix.elements);
	}
}
/*****************************************************************************************************
 *		main program
 *****************************************************************************************************/
WebGL.Main = function(){
	WebGL.context = $('canvas').getContext("experimental-webgl");
	WebGL.size.width = $('canvas').width;
	WebGL.size.height = $('canvas').height;
	WebGL.Matrix.init();
	initShaders();
	var angle = 0;
	var cube = new WebGL.Cube();
	var ball = new WebGL.Ball();
	var torus = new WebGL.Torus();
	var cylinder = new WebGL.Cylinder();
	this.timer = setInterval(draw,33);
	function initShaders(){
		var fshader = getShader(WebGL.context, "shader-fs");
		var vshader = getShader(WebGL.context, "shader-vs");
		if(!fshader || !vshader){
			throw 'error 1';
			return false;
		}
		WebGL.shaderProgram = WebGL.context.createProgram();
		WebGL.context.attachShader(WebGL.shaderProgram, vshader);
		WebGL.context.attachShader(WebGL.shaderProgram, fshader);
		WebGL.context.linkProgram(WebGL.shaderProgram);
		if (!WebGL.context.getProgramParameter(WebGL.shaderProgram, WebGL.context.LINK_STATUS)) {
			throw  "Could not initialize shaders";
		}
		WebGL.context.useProgram(WebGL.shaderProgram);
		WebGL.u_ModelMatrix = WebGL.context.getUniformLocation(WebGL.shaderProgram, 'u_ModelMatrix');
		WebGL.u_MvpMatrix = WebGL.context.getUniformLocation(WebGL.shaderProgram, 'u_MvpMatrix');
		WebGL.u_NormalMatrix = WebGL.context.getUniformLocation(WebGL.shaderProgram, 'u_NormalMatrix');
		WebGL.u_LightColor = WebGL.context.getUniformLocation(WebGL.shaderProgram, 'u_LightColor');
		WebGL.u_LightPosition = WebGL.context.getUniformLocation(WebGL.shaderProgram, 'u_LightPosition');
		WebGL.u_AmbientLight = WebGL.context.getUniformLocation(WebGL.shaderProgram, 'u_AmbientLight');
		WebGL.u_Color = WebGL.context.getUniformLocation(WebGL.shaderProgram, 'u_Color');
		if (!WebGL.u_MvpMatrix || !WebGL.u_NormalMatrix || !WebGL.u_LightColor ||
			!WebGL.u_LightPosition || !WebGL.u_AmbientLight || !WebGL.u_Color) {
			throw 'uniform error 2';
		}
		WebGL.context.uniform3f(WebGL.u_LightColor, 0.8, 0.8, 0.8);
		WebGL.context.uniform3f(WebGL.u_LightPosition, 0.0, 0.0, 20.0);
		WebGL.context.uniform3f(WebGL.u_AmbientLight, 0.2, 0.2, 0.2);

		function getShader(webglcontext, id){
			var shaderScript = $(id);
			if (!shaderScript) {
				return null;
			}
			var str = "";
			var scriptChild = shaderScript.firstChild;
			while (scriptChild) {
				if (scriptChild.nodeType == 3) {
					str += scriptChild.textContent;
				}
				scriptChild = scriptChild.nextSibling;
			}
			var shader;
			if (shaderScript.type == "x-shader/x-fragment") {
				shader = WebGL.context.createShader(WebGL.context.FRAGMENT_SHADER);
			} else if (shaderScript.type == "x-shader/x-vertex") {
				shader = WebGL.context.createShader(WebGL.context.VERTEX_SHADER);
			} else {
				return null;
			}

			WebGL.context.shaderSource(shader, str);
			WebGL.context.compileShader(shader);

			if (!WebGL.context.getShaderParameter(shader, WebGL.context.COMPILE_STATUS)) {
				alert(WebGL.context.getShaderInfoLog(shader));
				return null;
			}
			return shader;
		}
	}
	function draw(){
		WebGL.context.clearColor(0.0, 0.0, 0.0, 1.0);
		WebGL.context.clearDepth(1.0);
		WebGL.context.enable(WebGL.context.DEPTH_TEST);
		WebGL.context.depthFunc(WebGL.context.LEQUAL);
		WebGL.context.viewport(0, 0, WebGL.size.width, WebGL.size.height);
		WebGL.context.clear(WebGL.context.COLOR_BUFFER_BIT | WebGL.context.DEPTH_BUFFER_BIT);
		WebGL.Matrix.loadIdentity_view();
		WebGL.Matrix.perspective(25, (WebGL.size.width / WebGL.size.height), 0.1, 100.0);
		WebGL.Matrix.setLookAt(2.0, 3.0, 10.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
		WebGL.Matrix.setMatrixUniforms();
		WebGL.Matrix.setRotate(angle, [1.0,1.0,1.0]);
		cube.Cube_draw();
		ball.Ball_draw();
		torus.Torus_draw();
		cylinder.Cylinder_draw();
		angle++;
	}
}
