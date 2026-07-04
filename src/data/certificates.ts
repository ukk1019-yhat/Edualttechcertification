export interface Certificate {
  id: string
  name: string
  type: 'employee' | 'internship'
  issueDate: string
  description: string
  image: string
}

export const certificates: Certificate[] = [
  {
    id: 'EAT-EMP-001',
    name: 'Kavya Sri Vankayala',
    type: 'employee',
    issueDate: '2026-06-01',
    description: 'Employee certificate of appreciation for outstanding contribution to Edu Alt Tech.',
    image: '/certificates/kavya.png',
  },
  {
    id: 'EAT-EMP-002',
    name: 'Yuva Raj',
    type: 'employee',
    issueDate: '2026-06-01',
    description: 'Employee certificate of appreciation for outstanding contribution to Edu Alt Tech.',
    image: '/certificates/yuva.png',
  },
  {
    id: 'EAT-INT-001',
    name: 'Karthik',
    type: 'internship',
    issueDate: '2026-05-15',
    description: 'Internship certificate for successfully completing the internship program at Edu Alt Tech.',
    image: '/certificates/karthik.png',
  },
]

export const certificateTypes = [
  { value: 'all', label: 'All Certificates' },
  { value: 'employee', label: 'Employee Certificates' },
  { value: 'internship', label: 'Internship Certificates' },
]
