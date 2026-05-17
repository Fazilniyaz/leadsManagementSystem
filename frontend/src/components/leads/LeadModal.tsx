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
type FormErrors = Partial<Record<keyof typeof EMPTY, string>>

const NAME_REGEX = /^[A-Za-z\s'-]+$/
const PHONE_REGEX = /^[0-9]{10}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateForm(form: typeof EMPTY): FormErrors {
  const errors: FormErrors = {}

  if (!form.name.trim()) {
    errors.name = 'Name is required'
  } else if (form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
  } else if (!NAME_REGEX.test(form.name.trim())) {
    errors.name = 'Name can only contain letters, spaces, hyphens, or apostrophes'
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required'
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = 'Enter a valid email address'
  }

  if (form.phone && !PHONE_REGEX.test(form.phone.trim())) {
    errors.phone = 'Phone must be exactly 10 digits'
  }

  if (form.notes && form.notes.length > 500) {
    errors.notes = `Notes too long (${form.notes.length}/500 chars)`
  }

  return errors
}

export const LeadModal = ({ open, onClose, lead }: LeadModalProps) => {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState<FormErrors>({})
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
        assignedTo: String((lead.assignedTo as any)?._id ?? (lead.assignedTo as any)?.id ?? ''),
      })
    } else {
      setForm(EMPTY)
    }
    setErrors({})
  }, [lead, open])

  const set = (k: keyof typeof EMPTY, v: string) => {
    setForm(p => ({ ...p, [k]: v }))
    // Clear error on change
    if (errors[k]) setErrors(p => ({ ...p, [k]: undefined }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validateForm(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      status: form.status,
      source: form.source,
      notes: form.notes.trim() || undefined,
      assignedTo: form.assignedTo || undefined,
    }
    if (isEdit && lead) {
      update({ id: lead._id, payload }, { onSuccess: onClose })
    } else {
      create(payload, { onSuccess: onClose })
    }
  }

  const errStyle: React.CSSProperties = {
    color: '#f87171',
    fontSize: 12,
    marginTop: 4,
    display: 'block',
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit lead' : 'New lead'}>
      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Full name *">
          <input
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Arjun Kumar"
            style={errors.name ? { borderColor: 'rgba(248,113,113,0.6)' } : {}}
          />
          {errors.name && <span style={errStyle}>⚠ {errors.name}</span>}
        </FormField>

        <FormField label="Email *">
          <input
            type="email"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="arjun@gmail.com"
            style={errors.email ? { borderColor: 'rgba(248,113,113,0.6)' } : {}}
          />
          {errors.email && <span style={errStyle}>⚠ {errors.email}</span>}
        </FormField>

        <FormField label="Phone (optional — 10 digits)">
          <input
            value={form.phone}
            onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="9876543210"
            inputMode="numeric"
            maxLength={10}
            style={errors.phone ? { borderColor: 'rgba(248,113,113,0.6)' } : {}}
          />
          {errors.phone && <span style={errStyle}>⚠ {errors.phone}</span>}
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
            {salesUsers.map(u => {
              const uid = (u as any)._id ?? u.id
              return (
                <option key={uid} value={uid}>{u.name}</option>
              )
            })}
          </select>
        </FormField>

        <FormField label="Notes">
          <textarea
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="Any additional notes..."
            rows={3}
            style={{ resize: 'vertical', ...(errors.notes ? { borderColor: 'rgba(248,113,113,0.6)' } : {}) }}
          />
          {errors.notes && <span style={errStyle}>⚠ {errors.notes}</span>}
          <span style={{ fontSize: 11, color: '#444', marginTop: 2, display: 'block' }}>
            {form.notes.length}/500
          </span>
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