export function byte(value: number): number {
  try 
  {
    value = parseInt(value as any as string);

    if (value > 255) { 
      return 255; 
    }

    if (value < 0) { 
      return 0; 
    }

    return value;
  } 
  catch(error) 
  {
    console.error(error);

    return 0;
  }
}