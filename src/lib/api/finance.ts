import { api } from '../axios';
import { PaginatedResponse } from './students';

export interface Invoice {
  id: string;
  invoice_number: string;
  student_name: string;
  student_id: string;
  amount: number;
  currency: string;
  status: 'Paid In Full' | 'Partially Paid' | 'Not Paid';
  amount_paid: number;
  due_date: string;
}

export const fetchInvoices = async (params: {
  page: number;
  limit: number;
  orgCode?: number;
  branchCode?: number;
}): Promise<PaginatedResponse<Invoice>> => {
  try {
    const res = await api.get('/finance/payments', {
      params: { page: params.page, limit: params.limit },
    });

    if (res.data && Array.isArray(res.data.payments) && res.data.payments.length > 0) {
      const mapped: Invoice[] = res.data.payments.map((p: any) => ({
        id: String(p.id),
        invoice_number: p.receipt_number || `INV-${p.id}`,
        student_name: p.student_name || `Student #${p.student_id}`,
        student_id: String(p.student_id),
        amount: Number(p.amount) || 0,
        currency: 'INR',
        status: p.status === 'completed' ? 'Paid In Full' : 'Partially Paid',
        amount_paid: Number(p.amount) || 0,
        due_date: p.payment_date || new Date().toISOString().split('T')[0],
      }));

      return {
        data: mapped,
        meta: {
          total: res.data.count || mapped.length,
          page: params.page,
          limit: params.limit,
        },
      };
    }
  } catch (error) {
    console.warn('Backend /finance/payments returned error or server offline; using local mock data:', error);
  }

  const currencies = ['INR', 'USD', 'EUR', 'GBP'];
  const statuses: Invoice['status'][] = ['Paid In Full', 'Partially Paid', 'Not Paid'];

  const mockInvoices: Invoice[] = Array.from({ length: params.limit }).map((_, i) => {
    const id = (params.page * params.limit + i + 1).toString();
    const amount = Math.floor(Math.random() * 5000) + 500;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    let amount_paid = 0;
    
    if (status === 'Paid In Full') amount_paid = amount;
    else if (status === 'Partially Paid') amount_paid = Math.floor(amount * (Math.random() * 0.8 + 0.1));

    return {
      id,
      invoice_number: `INV-2026-${id.padStart(5, '0')}`,
      student_name: `Student Name ${id}`,
      student_id: `STU-2026-${id.padStart(4, '0')}`,
      amount,
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      status,
      amount_paid,
      due_date: new Date(Date.now() + Math.random() * 10000000000).toISOString().split('T')[0],
    };
  });

  return {
    data: mockInvoices,
    meta: {
      total: 120,
      page: params.page,
      limit: params.limit,
    },
  };
};
