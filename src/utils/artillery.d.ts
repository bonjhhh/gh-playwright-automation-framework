// artillery.d.ts
declare module 'artillery/core' {
    export interface Context {
      vars: { [key: string]: any };
    }
  
    export interface EventEmitter {
      emit(event: string, ...args: any[]): boolean;
    }
  }
  