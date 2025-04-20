export const processPayment = (): 'approved' | 'rejected' => {
  const isApproved = Math.random() > 0.2;
  return isApproved ? 'approved' : 'rejected';
};
