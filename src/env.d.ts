// src/env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_API_URL?: string;
      // tambahkan variabel env lain yang kamu pakai di frontend di bawah ini
      // REACT_APP_SOMETHING?: string;
    }
  }
}

export {};
