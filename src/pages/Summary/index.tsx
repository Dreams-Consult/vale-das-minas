import './index.css'
import morfologia1 from '../../assets/morfologia-1.png'
import morfologia2 from '../../assets/morfologia-2.png'
import morfologiaBottom from '../../assets/morfologia-mobile.png'
import { Button } from '../../components/Button'
import { useMediaQuery } from 'react-responsive'
import { useLocation, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'

type FormProps = {
  nome: string
  profissao: string
  telefone: string
  email: string
  renda: string
  estado: string
  veiculo: string
}

export function Summary() {
  const navigate = useNavigate()
  const location = useLocation()
  const isDesktop = useMediaQuery({ query: `(min-width: 1140px)` })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConsentChecked, setIsConsentChecked] = useState(false)

  const form = (location.state as { form?: FormProps } | null)?.form

  useEffect(() => {
    if (!form) {
      navigate('/cadastro', { replace: true })
    }
  }, [form, navigate])

  function handleEditData() {
    if (!form) {
      navigate('/cadastro')
      return
    }

    navigate('/cadastro', { state: { form } })
  }

  async function handleConfirmRegister() {
    if (!form || isSubmitting || !isConsentChecked) return

    try {
      setIsSubmitting(true)

      const response1 = fetch('https://n8n.fehshop.com/webhook/pag-nova', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
      })

      const response2 = fetch('https://n8n.fehshop.com/webhook/nova-pag', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
      })

      await Promise.all([response1, response2])
      navigate('/obrigado', { state: { fromSubscribe: true } })
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
      alert('Erro ao realizar cadastro. Tente novamente.')
      setIsSubmitting(false)
    }
  }

  if (!form) return null

  return (
    <div className='summary'>
      <div className='summary-form'>
        {isDesktop && (
          <div className='morfologia-left-summary'>
            <img className='morfologia-summary' src={morfologia1} />
          </div>
        )}

        <div className='content-summary'>
          <div className='text-summary'>
            <p className='title-summary'>TERMO DE CONSENTIMENTO</p>
            <p className='description-summary'>
              Leia os termos e condições para concluir seu cadastro.
            </p>
          </div>

          <div className='terms-card'>
            <p className='terms-heading'>Termo de Consentimento para Coleta e Uso de Dados</p>
            <p className='terms-text'>
              Nós coletamos e utilizamos alguns dados pessoais que pertencem aqueles que utilizam nosso
              site. Ao fazer isso, agimos na qualidade de controlador desses dados e estamos sujeitos as
              disposições da Lei Federal n.13.709/2018 (Lei Geral de Proteção de Dados Pessoais - LGPD).
            </p>
            <p className='terms-text'>
              Quero e estou ciente que posso receber informações sobre as últimas promoções e informações
              do Vale das Minas Park.
            </p>
          </div>

          <label className='consent-wrapper'>
            <input
              className='consent-checkbox'
              type='checkbox'
              checked={isConsentChecked}
              onChange={(e) => setIsConsentChecked(e.target.checked)}
            />
            <span className='consent-text'>Li e concordo com o termo de consentimento.</span>
          </label>

          {!isConsentChecked && (
            <p className='consent-warning'>Marque o aceite para confirmar o cadastro.</p>
          )}

          <div className='div-button-summary'>
            <Button text='VOLTAR' onClick={handleEditData} />
            <Button
              text={isSubmitting ? 'CONFIRMANDO...' : 'CONFIRMAR CADASTRO'}
              disabled={isSubmitting || !isConsentChecked}
              onClick={handleConfirmRegister}
            />
          </div>
        </div>

        {isDesktop && (
          <div className='morfologia-right-summary'>
            <img className='morfologia-summary' src={morfologia2} />
          </div>
        )}
      </div>

      {!isDesktop && (
        <div className='rodape-banner-summary'>
          <img className='morfologia-bottom-summary' src={morfologiaBottom} width={270} />
        </div>
      )}
    </div>
  )
}