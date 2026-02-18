export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipExpiry: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  createdAt: string;
  fineBalance: number;
}
