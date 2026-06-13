import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    clinicId: string;
  }

  interface Session {
    user: {
      id: string;
      clinicId: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    clinicId: string;
  }
}
