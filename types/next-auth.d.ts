import type { Role } from '@/types';

declare module 'next-auth' {
  interface User {
    role: Role;
    clinicId: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      role: Role;
      clinicId: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
    clinicId: string;
  }
}
