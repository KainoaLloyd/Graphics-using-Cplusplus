// Pass 2 fragment shader
//
// Outputs the Laplacian, computed from depth buffer

#version 330

// texCoordInc = the x and y differences, in texture coordinates,
// between one texel and the next.  For a window that is 400x300, for
// example, texCoordInc would be (1/400,1/300).

uniform vec2 texCoordInc;

// texCoords = the texture coordinates at this fragment

in vec2 texCoords;

// depthSampler = texture sampler for the depths.

uniform sampler2D depthSampler;

// fragLaplacian = an RGB value that is output from this shader.  All
// three components should be identical.  This RGB value will be
// stored in the Laplacian texture.

layout (location = 0) out vec3 fragLaplacian;


void main()

{
  // YOUR CODE HERE.  You will have to compute the Laplacian by
  // evaluating a 3x3 filter kernel at the current texture
  // coordinates.  The Laplacian weights of the 3x3 kernel are
  //
  //      -1  -1  -1
  //      -1   8  -1
  //      -1  -1  -1
  //
  // Store a signed value for the Laplacian; do not take its absolute
  // value.
//new
 //ragLaplacian = vec3(0,0,0);
//vec2 texCoordOffset = texCoordInc;
vec2 texCoordOffset;
	for (float i = -texCoordInc.x ; i<=texCoordInc.x; i +=texCoordInc.x){
		for (float j = -texCoordInc.y;j <=texCoordInc.y; j+=texCoordInc.y){
			vec2 offset = vec2 (i,j);
			if (i == 0 && j == 0){
				
				fragLaplacian+= vec3(8*texture( depthSampler, texCoords ));
			}else{
				texCoordOffset.x = texCoords.x+offset.x;
				texCoordOffset.y = texCoords.y+offset.y;
				fragLaplacian -= vec3(texture( depthSampler, texCoordOffset ));
			}
		}
	}
/*
	//top right
	fragLaplacian = -1* texture( depthSampler, texCoordOffset );
	//top left
	texCoordOffset.x = -1*texCoordOffset.x;
	fragLaplacian+= -1* texture( depthSampler, texCoordOffset );
	//bottom left
	texCoordOffset.y = -1*texCoordOffset.y;
	fragLaplacian+= -1* texture( depthSampler, texCoordOffset );
	//botton right
	texCoordOffset.x = -1*texCoordOffset.x;
	fragLaplacian+= -1* texture( depthSampler, texCoordOffset );
	//left middle
	texCoordOffset.y = 0;
	fragLaplacian+= -1* texture( depthSampler, texCoordOffset );
	//right middle
	texCoordOffset.x = -1*texCoordOffset.x;
	fragLaplacian+= -1* texture( depthSampler, texCoordOffset );
	//top middle
	texCoordOffset.y = texCoordsInc.y;
	texCoordOffset.x = 0;
	fragLaplacian+= -1* texture( depthSampler, texCoordOffset );
	//bottom middle
	texCoordOffset.y = -1*texCoordOffset.y;
	fragLaplacian+= -1* texture( depthSampler, texCoordOffset );
	texCoordOffset.y = 0;
	fragLaplacian+= 8* texture( depthSampler, texCoordOffset );
*/
	
//new ^
  
  //fragLaplacian = -1 * texture( depthSampler, texCoordOffset ) + ...
}
