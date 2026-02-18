export type UserRole = 'librarian' | 'member';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  memberId?: string; // for members, links to Member
}
