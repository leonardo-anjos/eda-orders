export interface Payment {
  orderId: string;
  status: 'approved' | 'rejected';
  timestamp: string;
}
