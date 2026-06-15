import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    facilityId: string;
  }

  interface Session {
    user: {
      id: string;
      facilityId: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    facilityId: string;
  }
}
