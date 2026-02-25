import { useState } from 'react'
import FamilyLayout from '../../components/layouts/FamilyLayout'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'
import { ErrorState } from '../../components/common/DataState'
import { usuarioService } from '../../services/api'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombrePaciente: '',
    direccion: '',
    contactoFamilia: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const onChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!emailRegex.test(formData.email)) {
      setError('Ingresa un email válido.')
      return
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (!formData.nombrePaciente.trim()) {
      setError('El nombre del paciente es obligatorio.')
      return
    }

    setLoading(true)
    try {
      await usuarioService.create({
        email: formData.email,
        password: formData.password,
        rol: 'familia'
      })
      setSuccess('Registro de usuario familiar completado. Luego inicia sesión para gestionar pacientes.')
    } catch {
      setError('No se pudo completar el registro. Verifica que el email no exista.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <FamilyLayout title="Registro Familiar">
      <div className="p-8 space-y-6">
        <PageHeader
          title="Client/Family Registration"
          description="Registro básico del usuario familiar para acceso a la plataforma."
          breadcrumb={[
            { label: 'Family', path: '/family/dashboard' },
            { label: 'Register' }
          ]}
        />

        {error && <ErrorState message={error} />}
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700 text-sm">
            {success}
          </div>
        )}

        <Card>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Email" name="email" type="email" value={formData.email} onChange={onChange} required />
            <Input label="Contraseña" name="password" type="password" value={formData.password} onChange={onChange} required />
            <Input label="Nombre del paciente" name="nombrePaciente" value={formData.nombrePaciente} onChange={onChange} required />
            <Input label="Dirección" name="direccion" value={formData.direccion} onChange={onChange} />
            <Input label="Contacto familiar" name="contactoFamilia" value={formData.contactoFamilia} onChange={onChange} />

            <div className="md:col-span-2">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Registrando...' : 'Crear cuenta familiar'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </FamilyLayout>
  )
}