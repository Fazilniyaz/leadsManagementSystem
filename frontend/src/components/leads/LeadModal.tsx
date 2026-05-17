import { useState, useEffect } from 'react'
import { Modal, FormField } from '../ui'
import { useCreateLead, useUpdateLead } from '../../hooks/useLeads'
import { useUsers } from '../../hooks/useUsers'
import type { Lead } from '../../types'

interface LeadModalProps {
  open: boolean
  onClose: () => void
  lead?: Lead | null
}

const EMPTY = { name: '', email: '', phone: '', status: 'new', source: 'website', notes: '', assignedTo: '' }

export const LeadModal = ({ open, onClose, lead }: LeadModalProps) => {
  const [form, setForm] = useState(EMPTY)
  const { mutate: create, isPending: creating } = useCreateLead()
  const { mutate: update, isPending: updating } = useUpdateLead()
  const { data: usersData } = useUsers()

  const salesUsers = (usersData?.data?.users ?? []).filter(u => u.role === 'sales')
  const isPending = creating || updating
  const isEdit = !!lead

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name,
        email: lead.email,
        phone: lead.phone ?? '',
        status: lead.status,
        source: lead.source,
        notes: lead.notes ?? '',
        assignedTo: (lead.assignedTo as any)?._id ?? (lead.assignedTo as any)?.id ?? '',
      })
    } else {
      setForm(EMPTY)
    }
  }, [lead, open])

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      status: form.status,
      source: form.source,
      notes: form.notes || undefined,
      assignedTo: form.assignedTo || undefined,
    }
    if (isEdit && lead) {
      update({ id: lead._id, payload }, { onSuccess: onClose })
    } else {
      create(payload, { onSuccess: onClose })
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit lead' : 'New lead'}>
      <form onSubmit={handleSubmit}>
        <FormField label="Full name *">
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Arjun Kumar" required />
        </FormField>

        <FormField label="Email *">
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="arjun@gmail.com" required />
        </FormField>

        <FormField label="Phone">
          <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="9876543210" />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormField label="Status">
            <select value={form.status} onChange={e => set('status', e.target.value)}>
              {['new', 'contacted', 'qualified', 'lost'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Source">
            <select value={form.source} onChange={e => set('source', e.target.value)}>
              {['website', 'instagram', 'referral'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField label="Assign to">
          <select value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
            <option value="">Unassigned</option>
            {salesUsers.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Notes">
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any additional notes..." rows={3} style={{ resize: 'vertical' }} />
        </FormField>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button type="button" onClick={onClose} className="btn-ghost" style={{ flex: 1 }}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isPending} style={{ flex: 1 }}>
            {isPending ? 'Saving...' : isEdit ? 'Save changes' : 'Create lead'}
          </button>
        </div>
      </form>
    </Modal>
  )
}