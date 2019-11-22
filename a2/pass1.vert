// Pass 1 vertex shader
//
// Stores colour, normal, depth

#version 330

uniform mat4 M;
uniform mat4 MV; //OCS-to-CCS
uniform mat4 MVP; //OCS-to-VCS

layout (location = 0) in vec3 vertPosition;
layout (location = 1) in vec3 vertNormal;
layout (location = 2) in vec3 vertTexCoord;

// Your shader should compute the colour, normal (in the VCS), and
// depth (in the range [0,1] with 0=near and 1=far) and store these
// values in the corresponding variables.

out vec3 colour;
out vec3 normal;
out float depth;

void main()

{
  // calc vertex position in CCS (always required)

  gl_Position = MVP * vec4( vertPosition, 1.0 );
	vec4 ccs_pos = gl_Position;
  // Provide a colour 

  //colour = vec3(1,0,0);         // YOUR CODE HERE //not sure about colour
///
	//added
	colour = 2.0*vec3(0.33, 0.42, 0.18);
	//colour = vec4(colour, 1.0f) //added
	
		//outputColour = vec4(normalized(normal), 1.0);
	//added ^
  // calculate normal in VCS

  //normal = vec3(0,1,0);         // YOUR CODE HERE
//added v
	//normal = vertNormal		//normal in OCS-to-CCS
	normal = vec3(MV*vec4(vertNormal, 0.0)); // normal in VCS
 //added ^
  // Calculate the depth in [0,1]
	//added	
		//calc vertex position in CCS
		depth = 0.5*((ccs_pos.z/ccs_pos.w)+1.0);
		//outputColour = vec4(depth, depth, depth, 1.0); ///not sure what does
	//added ^
 // depth = 0.5;                  // YOUR CODE HERE
}
