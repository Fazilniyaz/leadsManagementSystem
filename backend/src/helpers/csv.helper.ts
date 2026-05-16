import { ILead } from '../models/lead.model';

export const convertToCSV = (leads: ILead[]): string => {
  const headers = [
    'Name',
    'Email',
    'Phone',
    'Status',
    'Source',
    'Assigned To',
    'Notes',
    'Created At',
  ];

  const rows = leads.map((lead) => {
    const assignedTo = (lead.assignedTo as any)?.name ?? 'Unassigned';
    return [
      lead.name,
      lead.email,
      lead.phone ?? '',
      lead.status,
      lead.source,
      assignedTo,
      lead.notes ?? '',
      new Date(lead.createdAt).toLocaleDateString('en-IN'),
    ]
      .map((val) => `"${String(val).replace(/"/g, '""')}"`)
      .join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};