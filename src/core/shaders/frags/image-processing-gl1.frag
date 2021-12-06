precision highp float;

float g_goldNoise(float v, float seed) 
{
  return fract(tan(distance(v * 1.61803398874989484820459, v) * seed) * v);
}
float g_goldNoise(vec2 v, float seed) 
{
  return fract(tan(distance(v * 1.61803398874989484820459, v) * seed) * v.x);
}
float g_goldNoise(vec3 v, float seed) 
{
  return fract(tan(distance(v * 1.61803398874989484820459, v) * seed) * v.x);
}
float g_goldNoise(vec4 v, float seed) 
{
  return fract(tan(distance(v * 1.61803398874989484820459, v) * seed) * v.x);
}

uniform float u_rand;
uniform sampler2D u_image;

uniform float u_invert;
uniform vec3 u_hsl;
uniform float u_gamma;
uniform float u_noise;
uniform float u_sepia;
uniform float u_grayscale;
uniform vec3 u_temperature;
uniform float u_transparency;

varying vec2 v_texCoord;

vec3 rgbToHSL(float cR, float cG, float cB) 
{
  float r = cR / 255.0;
  float g = cG / 255.0;
  float b = cB / 255.0;

  float max = max(max(r, g), b); 
  float min = min(min(r, g), b);
  float del = max - min;

  float h = 0.0; 
  float s = 0.0; 
  float l = (max + min) / 2.0;

  if (max == min) 
  {
    return vec3(h, s, l);
  }

  if (l < 0.5)  
  {
    s = del / (max + min);
  }
  else  
  {
    s = del / (2.0 - max - min); 
  }

  float delR = ( ( ( max - r ) / 6.0 ) + ( del / 2.0 ) ) / del;
  float delG = ( ( ( max - g ) / 6.0 ) + ( del / 2.0 ) ) / del;
  float delB = ( ( ( max - b ) / 6.0 ) + ( del / 2.0 ) ) / del;

  if (r == max) 
  {
    h = delB - delG;
  }
  else if (g == max) 
  {
    h = (1.0 / 3.0) + delR - delB;
  }
  else if (b == max) 
  {
    h = (2.0 / 3.0) + delG - delR;
  }

  if (h < 0.0) 
  {
    h += 1.0;
  }

  if (h > 1.0) 
  {
    h -= 1.0;
  }

  return vec3(h, s, l);
}

float _hue_2_rgb_(float v1, float v2, float vH) 
{
  if (vH < 0.0) 
  {
    vH += 1.0;
  }

  if (vH > 1.0) 
  {
    vH -= 1.0;
  }

  if ((6.0 * vH) < 1.0)
  {
    return (v1 + (v2 - v1) * 6.0 * vH);
  }
  if ((2.0 * vH) < 1.0)
  {
    return v2;
  }
  if ((3.0 * vH) < 2.0)
  {
    return (v1 + (v2 - v1) * ((2.0 / 3.0) - vH) * 6.0);
  }

  return v1;
}

vec3 hslToRGB(float h, float s, float l) {
  float r = 0.0;
  float g = 0.0;
  float b = 0.0;
  float val1 = 0.0;
  float val2 = 0.0;

  if (s == 0.0)
  {
    r = l * 255.0;
    g = l * 255.0;
    b = l * 255.0;

    return vec3(r, g, b);
  }

  if (l < 0.5) 
  {
    val2 = l * (1.0 + s);
  }
  else
  {
    val2 = (l + s) - (l * s);
  }
      
  val1 = 2.0 * l - val2;

  r = 255.0 * _hue_2_rgb_(val1, val2, h + (1.0 / 3.0));
  g = 255.0 * _hue_2_rgb_(val1, val2, h);
  b = 255.0 * _hue_2_rgb_(val1, val2, h - (1.0 / 3.0));

  return vec3(r, g, b);
}



void main() {
  vec4 mainPixel = texture2D(u_image, v_texCoord);
  float x = mainPixel.x * 255.0;
  float y = mainPixel.y * 255.0;
  float z = mainPixel.z * 255.0;
  float w = mainPixel.w;

  // invert
  if (u_invert == 1.0) 
  {
    x = 255.0 - x;
    y = 255.0 - y;
    z = 255.0 - z;
  }

  // hsl
  {
    float sVal = u_hsl.y;
    float saturationAdd = 0.0;

    if (sVal < 0.0) 
    {
      sVal = (100.0 + sVal) / 100.0;
      sVal *= sVal;
    } 
    else 
    {
      sVal = sVal / 100.0;
    }
    
    if (u_hsl.y > 0.0) 
    {
      saturationAdd = sVal;
    }

    vec3 _hsl = rgbToHSL(x, y, z);
    vec3 _rgb = hslToRGB(_hsl.x + u_hsl.x, _hsl.y + saturationAdd, _hsl.z);

    x = _rgb.x;
    y = _rgb.y;
    z = _rgb.z;

    if (u_hsl.y < 0.0) 
    {
      float luR = 0.3086;
      float luG = 0.6094;
      float luB = 0.0820;

      x = ( ((1.0 - sVal) * luR + sVal) * x + ((1.0 - sVal) * luG) * y + ((1.0 - sVal) * luB) * z );
      y = ( ((1.0 - sVal) * luR) * x + ((1.0 - sVal) * luG + sVal) * x + ((1.0 - sVal) * luB) * z );
      z = ( ((1.0 - sVal) * luR) * x + ((1.0 - sVal) * luG) * y + ((1.0 - sVal) * luB + sVal) * z );
    }

    x = x + u_hsl.z;
    y = y + u_hsl.z;
    z = z + u_hsl.z;
  }

  // gamma
  {
    x = 255.0 * pow((x / 255.0), u_gamma);
    y = 255.0 * pow((y / 255.0), u_gamma);
    z = 255.0 * pow((z / 255.0), u_gamma);
  }

  // noise
  {
    float randAdd = 2.0 + 1.8 * u_rand;
    float ran = 0.0;

    x = x + ran;
    y = y + ran;
    z = z + ran;
  }

  // sepia
  if (u_sepia == 1.0) 
  {
    float red = x;
    float green = y;
    float blue = z;

    x = (0.393 * red) + (0.769 * green) + (0.189 * blue);
    y = (0.349 * red) + (0.686 * green) + (0.168 * blue);
    z = (0.272 * red) + (0.534 * green) + (0.131 * blue);
  }

  // grayscale
  if (u_grayscale == 1.0) 
  {
    x = y = z = ((x + y + z) / 3.0);
  }

  x = x * u_temperature.x;
  y = y * u_temperature.y;
  z = z * u_temperature.z;
  w = w * u_transparency;

  gl_FragColor = vec4(x / 255.0, y / 255.0, z / 255.0, w).rgba;
}
