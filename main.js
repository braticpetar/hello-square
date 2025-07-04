window.onload = function()
{
  // Initialize WebGL
  canvas = document.getElementById("mycanvas");
  gl = canvas.getContext("webgl");

  // Set the output resolution and viewport
  // We can change the output resolution later on.
  // This is helpful, for example, when the user changes the size of the window
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = pixelRatio * canvas.clientWidth;
  canvas.height = pixelRatio * canvas.clientHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Initialize other WebGL states
  gl.clearColor(1, 1, 1, 0); // Invisible white :)
  gl.lineWidth(1.0);


  ///////////////////////////////////////////////////////
  // Initialize the vertex buffer objects
  // We can update the contents of the vertex buffer objects anytime
  // We do NOT need to create them again

  var positions = [
    -0.8,  0.4, 0,
     0.8,  0.4, 0,
     0.8, -0.4, 0,
    -0.8,  0.4, 0,
     0.8, -0.4, 0,
    -0.8, -0.4, 0
  ];

  var colors = [
    1, 0, 0, 1,
    0, 1, 0, 1,
    0, 0, 1, 1,
    1, 0, 0, 1,
    0, 0, 1, 1,
    1, 0, 1, 1
  ];

  var position_buffer = gl.createBuffer();

  gl.bindBuffer(
    gl.ARRAY_BUFFER,
    position_buffer );

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positions),
    gl.STATIC_DRAW );

  var color_buffer = gl.createBuffer();

  gl.bindBuffer(
    gl.ARRAY_BUFFER,
    color_buffer );

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(colors),
    gl.STATIC_DRAW );

  ///////////////////////////////////////////////////////
  // Compile the vertex and fragment shaders into a program
  // We can modify the shader source code and recompile later
  // though typically a WebGL application would compile it's shaders only once
  // An application can have multiple shader programs and bind a different
  // shader program for rendering different objects in a scene.

  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, vertexShaderSource);
  gl.compileShader(vs);

  if (! gl.getShaderParameter(vs, gl.COMPILE_STATUS) ) {
    alert( gl.getShaderInfoLog(vs) );
    gl.deleteShader(vs);
  }

  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, fragmentShaderSource);
  gl.compileShader(fs);

  if ( ! gl.getShaderParameter(fs, gl.COMPILE_STATUS) ) {
    alert( gl.getShaderInfoLog(fs) );
    gl.deleteShader(fs);
  }

  prog = gl.createProgram()
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);

  if (! gl.getProgramParameter(prog, gl.LINK_STATUS) ) {
    alert(gl.getProgramInfoLog(prog) );
  }

  ///////////////////////////////////////////////////////
  // Update shader uniform variables
  // Before we render, we must set the values of the uniform variables
  // The uniform variables can be updated as frequently as needed

  var m = gl.getUniformLocation(prog, 'trans');

  var matrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1 ];

  gl.useProgram(prog);
  gl.uniformMatrix4fv( m, false, matrix );

  ///////////////////////////////////////////////////////
  // Set the vertex buffers used for rendering
  // Before we render, we must specify which vertex attributes are used
  // and which vertex buffer objects contain their data
  // Note that different object can use different sets of attributes
  // stored in different vertex buffer objects

  var p = gl.getAttribLocation(prog, 'pos');
  gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
  gl.vertexAttribPointer(p, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(p);

  var c = gl.getAttribLocation(prog, 'clr');
  gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
  gl.vertexAttribPointer(c, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(c);

  ///////////////////////////////////////////////////////
  // Render the scene
  // Now that everything is ready, we can render the scene
  // Rendering begins with clearing the image
  // Every time the scene changes, we must render again

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(prog);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

window.onload = main;
