import './index.css'
import { Button } from '../../components/Button'
import morfologia1 from '../../assets/morfologia-1.png'
import morfologia2 from '../../assets/morfologia-2.png'
import { TextField } from '../../components/TextField'
import { Select } from '../../components/Select'
import { useState } from 'react'
import { object, string, number, ValidationError } from 'yup';
import morfologiaBottom from '../../assets/morfologia-mobile.png'
import { useMediaQuery } from 'react-responsive'
import { useNavigate } from 'react-router'

type FormProps = {
  nome: string
  profissao: string
  telefone: string
  email: string
  renda: number | null
  estado: string
  cidade: string
  veiculo: string
}

type FormErrors = {
  nome?: string
  telefone?: string
  email?: string
}

const formSchema = object({
  nome: string().default('').required("Preencha seu nome corretamente."),
  telefone: string().default('').required("Preencha seu telefone corretamente."),
  email: string().default('').email("E-mail precisa ser válido.").required("Preencha seu e-mail corretamente."),
  profissao: string().default(''),
  renda: number().default(null).nullable(),
  estado: string().default(''),
  cidade: string().default(''),
  veiculo: string().default(''),
});

export function Subscribe() {
  const isMobile = useMediaQuery({ query: `(min-width: 1140px)` });
  const navigate = useNavigate()
  const [erros, setErros] = useState<FormErrors>({})
  const [form, setForm] = useState<FormProps>({
    nome: "",
    profissao: "",
    telefone: "",
    email: "",
    renda: null,
    estado: "",
    cidade: "",
    veiculo: "",
  })

  function validateField(fieldName: keyof FormProps, value: string | number | null) {
    formSchema
      .validateAt(fieldName, { [fieldName]: value })
      .then(() => {
        setErros((prev) => ({ ...prev, [fieldName]: '' }))
      })
      .catch((error: ValidationError) => {
        setErros((prev) => ({ ...prev, [fieldName]: error.message }))
      })
  }

  function sendForm() {
    const response1 = fetch("https://n8n.fehshop.com/webhook/pag-nova", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    const response2 = fetch("https://n8n.fehshop.com/webhook/nova-pag", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    Promise.all([response1, response2]).then(() => {
      alert("Cadastro realizado com sucesso!")
      navigate('/')
    });

    navigate('/obrigado')
  }

  function formatPhone(value: string): string {
    const cleaned = value.replace(/\D/g, '').substring(0, 11);
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }

  function formatCurrency(value: string): string {
    const cleaned = value.replace(/\D/g, '');
    const number = parseInt(cleaned, 10);
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(number / 100);
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhone(e.target.value);
    setForm({...form, telefone: formatted});
  }

  function handleRendaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const cleaned = e.target.value.replace(/\D/g, '');
    const number = parseInt(cleaned, 10);
    setForm({...form, renda: isNaN(number) ? null : number / 100});
  }

  function logon() {
    formSchema.validate( form, { abortEarly: false } )
    .then(() => {
        setErros({
          nome: "",
          telefone: "",
          email: ""
        })
        sendForm()
    })
    .catch((error: ValidationError) => {
    const newErrors: Record<string, string> = {};

    error.inner.forEach((e) => {
      if (e.path) newErrors[e.path] = e.message;
    });

    setErros(newErrors);
  });
  }

  return (
        <div className='subscribe'>
          <div className='form'>
        {
          isMobile && (<div className='morfologia-left-subscribe'>
          <img src={morfologia1} width={270} />
        </div>)
        }
          <div className='content-subscribe'>
            <div className='div-content-subscribe'>
              <div className='div-content-subscribe-part'>
                <TextField label='Seu nome completo *' name="name" text={form.nome} placeholder='Digite seu nome aqui' errorMessage={erros.nome} onChange={(e) => setForm({...form, nome: e.target.value})} onBlur={(e) => validateField('nome', e.target.value)} />
                <TextField label='Telefone *' name="phoneNumber" text={form.telefone}  placeholder='(00) 00000-0000' errorMessage={erros.telefone} onChange={handlePhoneChange} onBlur={(e) => validateField('telefone', e.target.value)} />
                <TextField label='E-mail *' name="email" text={form.email} errorMessage={erros.email} placeholder='Digite seu email aqui' onChange={(e) => setForm({...form, email: e.target.value})} onBlur={(e) => validateField('email', e.target.value)} />
                <TextField label='Profissão' name="profession" text={form.profissao}  placeholder='Digite sua profissão aqui' onChange={(e) => setForm({...form, profissao: e.target.value})} onBlur={(e) => validateField('profissao', e.target.value)} />
              </div>
              <div className='div-content-subscribe-part'>
                <TextField label='Renda Familiar' name="income" text={form.renda ? formatCurrency(String(form.renda * 100)) : ""} placeholder='R$ 0,00' onChange={handleRendaChange}/>
                <Select 
                  label='Estado Civil' 
                  name="maritalStatus" 
                  value={form.estado} 
                  placeholder='Selecione seu estado civil'
                  options={[
                    { value: 'solteiro', label: 'Solteiro(a)' },
                    { value: 'casado', label: 'Casado(a)' },
                    { value: 'divorciado', label: 'Divorciado(a)' },
                    { value: 'viuvo', label: 'Viúvo(a)' },
                    { value: 'uniao_estavel', label: 'União Estável' },
                  ]}
                  onChange={(e) => setForm({...form, estado: e.target.value})} 
                  onBlur={(e) => validateField('estado', e.target.value)} 
                />
                <TextField label='Cidade' name="city" text={form.cidade} placeholder='Digite sua cidade' onChange={(e) => setForm({...form, cidade: e.target.value})} onBlur={(e) => validateField('cidade', e.target.value)} />
                <TextField label='Veículo' name="vehicle" text={form.veiculo} onChange={(e) => setForm({...form, veiculo: e.target.value})} placeholder='Digite seu veículo aqui' onBlur={(e) => validateField('veiculo', e.target.value)} />
              </div>
            </div>

          <div className='div-button-subscribe'>
            <Button text="CADASTRAR" onClick={logon} />
          </div>
        </div>
        {
          isMobile && (<div className='morfologia-right-subscribe'>
          <img src={morfologia2} width={270} />
        </div>)
        }
      </div>
      {
        !isMobile &&
        (
          <div className='rodape-banner'>
            <img className='morfologia-bottom-subscribe' src={morfologiaBottom} width={270} />
          </div>
        )
      }
        </div>
  )
}
