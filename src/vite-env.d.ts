/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_FRONTEND_ORIGIN?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_KAKAO_CLIENT_ID?: string;
  readonly VITE_GOOGLE_REDIRECT_URI?: string;
  readonly VITE_KAKAO_REDIRECT_URI?: string;
  readonly VITE_GOOGLE_SCOPE?: string;
  readonly VITE_KAKAO_SCOPE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
