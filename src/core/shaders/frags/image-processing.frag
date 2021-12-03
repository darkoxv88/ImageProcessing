#version 300 es
precision highp float;

float g_goldNoise(float v, float seed) 
{
  return fract(tan(distance(v * 1.61803398874989484820459f, v) * seed) * v);
}
float g_goldNoise(vec2 v, float seed) 
{
  return fract(tan(distance(v * 1.61803398874989484820459f, v) * seed) * v.x);
}
float g_goldNoise(vec3 v, float seed) 
{
  return fract(tan(distance(v * 1.61803398874989484820459f, v) * seed) * v.x);
}
float g_goldNoise(vec4 v, float seed) 
{
  return fract(tan(distance(v * 1.61803398874989484820459f, v) * seed) * v.x);
}
uint g_hash(uint x) 
{
  x += (x << 10u);
  x ^= (x >>  6u);
  x += (x <<  3u);
  x ^= (x >> 11u);
  x += (x << 15u);
  return x;
}
uint g_hash(uvec2 v) 
{ 
  return g_hash( v.x ^ g_hash(v.y)); 
}
uint g_hash(uvec3 v) 
{ 
  return g_hash( v.x ^ g_hash(v.y) ^ g_hash(v.z)); 
}
uint g_hash(uvec4 v) 
{ 
  return g_hash( v.x ^ g_hash(v.y) ^ g_hash(v.z) ^ g_hash(v.w) );
}
float g_floatConstruct(uint m) 
{
  const uint ieeeMantissa = 0x007FFFFFu;
  const uint ieeeOne = 0x3F800000u; 

  m &= ieeeMantissa;                     
  m |= ieeeOne;                          

  float f = uintBitsToFloat( m );   

  return f - 1.0;                       
}
float g_random(float v) 
{ 
  return g_goldNoise(v, g_floatConstruct(g_hash(floatBitsToUint(v))));
}
float g_random(vec2  v) 
{ 
  return g_goldNoise(v, g_floatConstruct(g_hash(floatBitsToUint(v))));
}
float g_random(vec3  v) 
{ 
  return g_goldNoise(v, g_floatConstruct(g_hash(floatBitsToUint(v))));
}
float g_random(vec4  v) 
{ 
  return g_goldNoise(v, g_floatConstruct(g_hash(floatBitsToUint(v))));
}

uniform float u_invert;
uniform vec3 u_hsl;
uniform float u_gamma;
uniform float u_noise;
uniform float u_sepia;
uniform float u_grayscale;
uniform vec3 u_temperature;
uniform float u_transparency;

uniform sampler2D u_image;
in vec2 v_texCoord;
out vec4 outColor;

vec3 rgbToHSL(float cR, float cG, float cB) 
{
  float r = cR / 255.0f;
  float g = cG / 255.0f;
  float b = cB / 255.0f;

  float max = max(max(r, g), b); 
  float min = min(min(r, g), b);
  float del = max - min;

  float h = 0.0f; 
  float s = 0.0f; 
  float l = (max + min) / 2.0f;

  if (max == min) 
  {
    return vec3(h, s, l);
  }

  if (l < 0.5f)  
  {
    s = del / ( max + min );
  }
  else  
  {
    s = del / ( 2.0f - max - min ); 
  }

  float delR = ( ( ( max - r ) / 6.0f ) + ( del / 2.0f ) ) / del;
  float delG = ( ( ( max - g ) / 6.0f ) + ( del / 2.0f ) ) / del;
  float delB = ( ( ( max - b ) / 6.0f ) + ( del / 2.0f ) ) / del;

  if (r == max) 
  {
    h = delB - delG;
  }
  else if (g == max) 
  {
    h = ( 1.0f / 3.0f ) + delR - delB;
  }
  else if (b == max) 
  {
    h = ( 2.0f / 3.0f ) + delG - delR;
  }

  if (h < 0.0f) 
  {
    h += 1.0f;
  }

  if (h > 1.0f) 
  {
    h -= 1.0;
  }

  return vec3(h, s, l);
}

float _hue_2_rgb_(float v1, float v2, float vH) {
  if (vH < 0.0) 
  {
    vH += 1.0;
  }

  if (vH > 1.0) 
  {
    vH -= 1.0;
  }

  if ((6.0f * vH) < 1.0f) return (v1 + (v2 - v1) * 6.0f * vH);
  if ((2.0f * vH) < 1.0f) return v2;
  if ((3.0f * vH) < 2.0f) return (v1 + (v2 - v1) * ((2.0f / 3.0f) - vH) * 6.0f);

  return v1;
}

vec3 hslToRGB(float h, float s, float l) {
  float r = 0.0f;
  float g = 0.0f;
  float b = 0.0f;
  float val1 = 0.0f;
  float val2 = 0.0f;

  if (s == 0.0f)
  {
    r = l * 255.0f;
    g = l * 255.0f;
    b = l * 255.0f;

    return vec3(r, g, b);
  }

  if (l < 0.5) 
  {
    val2 = l * (1.0f + s);
  }
  else
  {
    val2 = (l + s) - (l * s);
  }
      
  val1 = 2.0 * l - val2;

  r = 255.0f * _hue_2_rgb_(val1, val2, h + (1.0f / 3.0f));
  g = 255.0f * _hue_2_rgb_(val1, val2, h);
  b = 255.0f * _hue_2_rgb_(val1, val2, h - (1.0f / 3.0f));

  return vec3(r, g, b);
}



void main() 
{
  vec2 onePixel = vec2(1) / vec2(textureSize(u_image, 0));
  vec4 mainPixel = texture(u_image, v_texCoord);
  float x = mainPixel.x * 255.0f;
  float y = mainPixel.y * 255.0f;
  float z = mainPixel.z * 255.0f;
  float w = mainPixel.w * 255.0f;

  if (u_invert == 1.0f) 
  {
    x = 255.0f - x;
    y = 255.0f - y;
    z = 255.0f - z;
  }

  // hsl
  {
    float sVal = u_hsl.y;
    float saturationAdd = 0.0f;

    if (sVal < 0.0f) 
    {
      sVal = (100.0f + sVal) / 100.0f;
      sVal *= sVal;
    } 
    else 
    {
      sVal = sVal / 100.0f;
    }
    
    if (u_hsl.y > 0.0f) 
    {
      saturationAdd = sVal;
    }

    vec3 _hsl = rgbToHSL(x, y, z);
    vec3 _rgb = hslToRGB(_hsl.x + u_hsl.x, _hsl.y + saturationAdd, _hsl.z);

    x = _rgb.x;
    y = _rgb.y;
    z = _rgb.z;

    if (u_hsl.y < 0.0f) 
    {
      float luR = 0.3086;
      float luG = 0.6094;
      float luB = 0.0820;

      x = ( ((1.0f - sVal) * luR + sVal) * x + ((1.0f - sVal) * luG) * y + ((1.0f - sVal) * luB) * z );
      y = ( ((1.0f - sVal) * luR) * x + ((1.0f - sVal) * luG + sVal) * x + ((1.0f - sVal) * luB) * z );
      z = ( ((1.0f - sVal) * luR) * x + ((1.0f - sVal) * luG) * y + ((1.0f - sVal) * luB + sVal) * z );
    }

    x = x + u_hsl.z;
    y = y + u_hsl.z;
    z = z + u_hsl.z;
  }

  // gamma
  {
    x = 255.0f * pow((x / 255.0f), u_gamma);
    y = 255.0f * pow((y / 255.0f), u_gamma);
    z = 255.0f * pow((z / 255.0f), u_gamma);
  }

  // noise
  {
    float ran = (0.5f - g_random(v_texCoord + vec2(3.14f, 3.14f))) * u_noise;

    x = x + ran;
    y = y + ran;
    z = z + ran;
  }

  if (u_sepia == 1.0f) 
  {
    float red = x;
    float green = y;
    float blue = z;

    x = (0.393f * red) + (0.769f * green) + (0.189f * blue);
    y = (0.349f * red) + (0.686f * green) + (0.168f * blue);
    z = (0.272f * red) + (0.534f * green) + (0.131f * blue);
  }

  if (u_grayscale == 1.0f) 
  {
    x = y = z = ((x + y + z) / 3.0f);
  }

  x = x * u_temperature.x;
  y = y * u_temperature.y;
  z = z * u_temperature.z;
  w = w * u_transparency;

  outColor = vec4(x / 255.0f, y / 255.0f, z / 255.0f, w).rgba;
}
