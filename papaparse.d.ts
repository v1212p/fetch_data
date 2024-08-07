declare module 'papaparse' {
    export function parse(input: string | File, config: any): any;
    export function unparse(data: any, config?: any): string;
  }
  