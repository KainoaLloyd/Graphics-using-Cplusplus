// trace.frag
//
// Fragment shader for tracing through refractive volume

#version 330

uniform sampler3D texture_volume;     // tau values
uniform sampler3D texture_gradient;   // gradient values 
uniform sampler2D texture_background; // background 2D grid texture


uniform float stepSize;         // step size in texture coordinate system
uniform float densityFactor;    // factor by which to change optical densities

uniform int   flag;             // flag from C++ for any purpose.  Press digit to change flag.

uniform vec3  volumeOrigin;     // 000 corner of volume in WCS 
uniform vec3  volumeX;          // x axis of volume in WCS
uniform vec3  volumeY;          // y axis of volume in WCS
uniform vec3  volumeZ;          // z axis of volume in WCS

uniform vec3  bgOrigin;	        // 00 corner of background texture in WCS
uniform vec3  bgX;		//    - background texture is a grid in directions bgX and bgY
uniform vec3  bgY;		//    - background texture normal is in direction bgZ
uniform vec3  bgZ;              //    - bgX, bgY, bgZ are unit vectors in WCS
uniform float bgXdim;		//    - bgXdim, bgYdim are x and y dimensions in WCS
uniform float bgYdim;

uniform vec3  eyePosition;      // eye position in WCS

in vec3 texCoords;              // texCoords of this fragment on the face of the volume

out vec4 fragColour;		// output colour



// Determine the direction in which a ray refracts or reflects when
// cross a surface from index of refraction n1 to index of refraction
// n2.
//
// The incomingDir is the direction of the ray hitting the surface.
// The gradient is the volume gradient at the ray/surface point.  The
// gradient is not normalized and might be very small, in which case
// the direction doesn't change.  The gradient could point into or out
// of the surface.
//
// The ray might undergo total internal reflection if its angle of
// incidence is large enough.  That is also handled by this code.


vec3 refractionOrReflectionDirection( float n1, float n2, vec3 incomingDir, vec3 gradient )

{
  // For areas of no density change, the gradient will be very small.
  // Don't change direction in those areas.

     // [YOUR CODE HERE]

  // Check for total internal reflection

     // [YOUR CODE HERE]

  // Compute new direction based on refraction with Snell's Law or on
  // ideal reflection.

     // [YOUR CODE HERE]

  // Return the noramlized new direction

  return normalize( incomingDir ); // [YOUR CODE HERE]
}


// Determine the RGB value from the background texture as seen from a
// ray starting at 'start' in direction 'dir'.
//
// The texture has origin bgOrigin and local coordinate system
// <bgX,bgY,bgZ).  It has dimension bgXdim in the bgX direction and
// dimension bgYdim in the bgY direction.
//
// All vectors are in the WCS.


vec3 lookupBackgroundTexture( vec3 start, vec3 dir )

{
  // Find the intersection of "start + t dir" with the plane "n dot x
  // = k" of the texture.  Return white if the ray is close to being
  // parallel to the plane.

     // [YOUR CODE HERE]

  // If the intersection point is outside the bounds of the texture,
  // return white.

     // [YOUR CODE HERE]

  // Return the texture value at the intersection point

  return vec3(1,0,0); // [YOUR CODE HERE]
}



// We'll trace through the volume using the Texture Coordinate System
// (TCS) of the volume, which has its origin at the 000 corner of the
// volume and has x,y,z axes that span the corresponding edges of the
// volume.  The volume spans [0,1]x[0,1]x[0,1] in the TCS.
//
// In the WCS, the volume has origin volumeOrigin and local coordinate
// system <volumeX,volumeY,volumeZ).
//
// Note that the volumeX, volumeY, and volumeZ vectors are *not*
// unit-length; their length is that of the corresponding edge of the
// volume in the WCS.


void main()

{
  // Get TCS position of fragment

  vec3 pos = texCoords;

  // Get WCS position and direction into the volume from the eye position

  vec3 fragPosition = vec3(0,0,0); // [YOUR CODE HERE]

  vec3 dirToFrag = vec3(0,0,0); // [YOUR CODE HERE]

  // Convert WCS direction to normalized TCS direction

  vec3 dir = vec3(0,0,1); // [YOUR CODE HERE}

  // Debugging: Press '1' to check that lookupBackgroundTexture() is
  // working.  It should appear as if there's no volume when this is
  // done, since the texture behind the volume is shown.  (You can
  // press 'b' to show the volume outline while doing this.)

  if (flag == 1) {
    fragColour = vec4( lookupBackgroundTexture( fragPosition, dirToFrag ), 1 );
    return;
  }
  
  // Maintain the total transparency of the ray travelled so far

  float totalTransparency = 1.0;

  // Store the opacity at the previous step

  float prevTau = 0.0;          // initially = value outside of volume

  // Limit the number of steps to that corresponding to 10 times the
  // distance across the volume.

  int maxNumSteps = int( 10.0 / stepSize );

  // Step through the volume

  int i;
  for (i=0; i<maxNumSteps; i++) {

    // Accumulate transparency

    totalTransparency = 0.1; // [YOUR CODE HERE]

    // Find the gradient halfway between previous and next positions

    vec3 gradient = vec3(0,0,1); // [YOUR CODE HERE]

    // Get tau at the next position

    float tau = 0.1; // [YOUR CODE HERE]

    // We'll assume that the index of refraction is 1+tau*k, for some
    // 'densifying' factor k that globally varies the density.

    float n1 = 1.0 + prevTau * densityFactor;
    float n2 = 1.0 + tau * densityFactor;

    // Compute the new direction based on Snell's law.

    vec3 newDir = dir; // [YOUR CODE HERE]

    // Debugging: Press '2' or '3' to skip the refraction/reflection
    // step above.  The ray should go straight through the volume and
    // be coloured with the texture coordinates at the exit point (see
    // farther below).

    if (flag == 2 || flag == 3)
      newDir = dir; // no refraction/reflection

    // Move the position half a step forward in the original
    // direction, then half a step forward in the new direction.

    pos = vec3(0,0,1); // [YOUR CODE HERE]

    // Stop if we have exited the volume (but only *after* the first
    // iteration so that we will have travelled at least one step into
    // the volume).

       // [YOUR CODE HERE]

    // Update and continue

    prevTau = tau;
    dir = newDir;
  }

  // If too many steps were taken, output white.

  if (i == maxNumSteps) {
    fragColour = vec4( 1, 1, 1, 1 );
    return;
  }

  // Debugging: If '2', show texture coordinates at exit point.  If
  // '3', show total transparency in straight line to exit point.
  //
  // Note: When using '3', increase the density factor (e.g. to 1.0 or
  // 2.0) to see the accumulated transparency.

  if (flag == 2) {
    fragColour = vec4( pos, 1 );
    return;
  } else if (flag == 3) {
    fragColour = vec4( totalTransparency, totalTransparency, totalTransparency, 1 );
    return;
  }

  // Find exiting position and direction in WCS

     // [YOUR CODE HERE]

  // Given pos and dir in WCS, find the colour coming from that
  // direction and modulate it by the accumulated transparency

     // [YOUR CODE HERE]

  fragColour = vec4(1,0,0,1);
}
