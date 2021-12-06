#version 300 es

in vec2 a_position;
in vec2 a_texCoord;

uniform vec2 u_resolution;
uniform float u_flipVertical;
uniform float u_flipHorizontal;

out vec2 v_texCoord;

void main() {
  vec2 zeroToOne = a_position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  vec2 texCoord = vec2(a_texCoord.x, a_texCoord.y);

  if (u_flipVertical == 1.0f)
  {
    texCoord.x = 1.0f - texCoord.x;
  }

  if (u_flipHorizontal == 1.0f)
  {
    texCoord.y = 1.0f - texCoord.y;
  }

  v_texCoord = texCoord;
}
