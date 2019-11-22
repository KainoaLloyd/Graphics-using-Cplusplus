// Pass 3 fragment shader
//
// Output fragment colour based using
//    (a) Cel shaded diffuse surface
//    (b) wide silhouette in black

#version 330

uniform vec3      lightDir;     // direction toward the light in the VCS
uniform vec2      texCoordInc;  // texture coord difference between adjacent texels

in vec2 texCoords;              // texture coordinates at this fragment

// The following four textures are now available and can be sampled
// using 'texCoords'

uniform sampler2D colourSampler;
uniform sampler2D normalSampler;
uniform sampler2D depthSampler;
uniform sampler2D laplacianSampler;

out vec4 outputColour;          // the output fragment colour as RGBA with A=1


void main()

{
  // [0 marks] Look up values for the depth and Laplacian.  Use only
  // the R component of the texture as texture2D( ... ).r

  //new
	//float depth = texture2D(depthSampler, texCoords).r;
	//float laplacian = texture2D(laplacianSampler, texCoords).r;

	float depth = texture(depthSampler, texCoords).r;
	float laplacian = texture(laplacianSampler, texCoords).r;
  //new^
  // YOUR CODE HERE

  // [1 mark] Discard the fragment if it is a background pixel not
  // near the silhouette of the object.
//new
if (laplacian == 0 && depth >0.9){
	//outputColour = vec4(1, 0.7, 0.3, 1);
	discard;
	}

//new^
  // YOUR CODE HERE

  // [0 marks] Look up value for the colour and normal.  Use the RGB
  // components of the texture as texture2D( ... ).rgb or texture2D( ... ).xyz.
	//new
	vec3 kd = texture(colourSampler,texCoords).rgb;
	//vec3 N = normalize(texture(normalSampler, texCoords).xyz);
	vec3 N = (texture(normalSampler, texCoords).xyz);
	//^new^
  // YOUR CODE HERE

  // [2 marks] Compute Cel shading, in which the diffusely shaded
  // colour is quantized into four possible values.  Do not allow the
  // diffuse component, N dot L, to be below 0.2.  That will provide
  // some ambient shading.  Your code should use the 'numQuata' below
  // to have that many divisions of quanta of colour.  Your code
  // should be very efficient.

  const int numQuanta = 3;

  //new
 float divMultiplier;
float quantaSize = 0.8/(numQuanta+1.0);

float NdotL = dot(N ,lightDir);

if (NdotL <0.2){
	divMultiplier = 0.2;
}else{
	float quantum = floor((NdotL-0.2)/quantaSize);
	divMultiplier = 0.2 + (quantum*quantaSize);
	
}
vec4 quantumColour = vec4(divMultiplier*kd, 1.0);
  //new^
  // YOUR CODE HERE

  // [2 marks] Count number of fragments in the 3x3 neighbourhood of
  // this fragment with a Laplacian that is less than -0.1.  These are
  // the edge fragments.  Your code should use the 'kernelRadius'
  // below and check all fragments in the range
  //
  //    [-kernelRadius,+kernelRadius] x [-kernelRadius,+kernelRadius]
  //
  // around this fragment.

  const int kernelRadius = 1;
  //new
	int numFrags = 0;
	for (int i = -kernelRadius ; i<=kernelRadius; i++){
		for (int j = -kernelRadius;j <=kernelRadius; j++){
			vec2 offset = texCoords +vec2 (i*texCoordInc.x,j*texCoordInc.y);
			if (texture(laplacianSampler, offset).r<-0.1){
				numFrags++;
			}
		}
	}
	
  //new^
  

  // YOUR CODE HERE

  // [0 marks] Output the fragment colour.  If there is an edge
  // fragment in the 3x3 neighbourhood of this fragment, output a
  // black colour.  Otherwise, output the cel-shaded colour.
  //
  // Since we're making this black is there is any edge in the 3x3
  // neighbourhood of the fragment, the silhouette will be wider
  // than if we test only the fragment.

  // YOUR CODE HERE
  //new

if (numFrags > 0){
 outputColour = vec4( 0, 0, 0, 1 );
}else{
	outputColour = quantumColour;
	//new^
}

 
}
