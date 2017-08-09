export class Cast {
  public static readonly U_BYTE_MIN :number =           0;
  public static readonly U_BYTE_MAX :number =         255;

  public static readonly S_BYTE_MIN :number = -       128;
  public static readonly S_BYTE_MAX :number =         127;


  public static readonly U_SHORT_MIN:number =           0;
  public static readonly U_SHORT_MAX:number =       65535;

  public static readonly S_SHORT_MIN:number = -     32768;
  public static readonly S_SHORT_MAX:number =       32767;


  public static readonly U_INT_MIN  :number =           0;
  public static readonly U_INT_MAX  :number =  4294967295;

  public static readonly S_INT_MIN  :number = -2147483648;
  public static readonly S_INT_MAX  :number =  2147483647;

  public static ubyte(v:number):number {
    return v & Cast.U_BYTE_MAX;
  }

  public static ushort(v:number):number {
    return v & Cast.U_SHORT_MAX;
  }

  public static uint(v:number):number {
    return v >>> 0;
  }

  public static byte(v:number):number {
    return Cast.ubyte(v) << 24 >> 24;
  }

  public static short(v:number):number {
    return Cast.ushort(v) << 16 >> 16;
  }

  public static int(v:number):number {
    return v | 0;
  }

  public static double(v:number):number {
    return isFinite(v) ? v : 0;
  }

  public static float(v:number):number {
    return Math.fround(Cast.double(v));
  }

  public static normal(v:number):number {
    if(Cast.double(v) > 1.0) return 1.0;
    if(Cast.double(v) < 0.0) return 0.0;
    return double(v);
  }
}

export function ubyte(v:number):number {
  return Cast.ubyte(v);
}

export function ushort(v:number):number {
  return Cast.ushort(v);
}

export function uint(v:number):number {
  return Cast.uint(v);
}

export function byte(v:number):number {
  return Cast.byte(v);
}

export function short(v:number):number {
  return Cast.short(v);
}

export function int(v:number):number {
  return Cast.int(v);
}

export function double(v:number):number {
  return Cast.double(v);
}

export function float(v:number):number {
  return Cast.float(v);
}

export function normal(v:number):number {
  return Cast.normal(v);
}
