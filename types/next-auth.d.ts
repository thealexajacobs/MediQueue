import type { Role } from '@/types';

declare module 'next-auth' {
  interface User {
    role: Role;
    clinicId: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
      clinicId: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string;
    role: Role;
    clinicId: string;
  }
}
