import './index.css'
import { Button } from '../../components/Button'
import morfologia1 from '../../assets/morfologia-1.png'
import morfologia2 from '../../assets/morfologia-2.png'
import { TextField } from '../../components/TextField'
import { useState, type KeyboardEvent } from 'react'
import { object, string, ValidationError } from 'yup';
import morfologiaBottom from '../../assets/morfologia-mobile.png'
import { useMediaQuery } from 'react-responsive'
import { Select } from '../../components/Select/index'
import { useNavigate } from 'react-router'

type FormProps = {
  nome: string
  profissao: string
  telefone: string
  email: string
  renda: string
  estado: string
  veiculo: string
}

type FormErrors = {
  nome?: string
  telefone?: string
  email?: string
  renda?: string
  estado?: string
  profissao?: string
  veiculo?: string
}

type MyObjectFormType = {
  [key: number]: { label: string; name: string, placeholder: string, text: string | number | null, erro?: string};
};

type MyObjectSelectType = {
  [key: number]: { label: string; name: string, placeholder: string, options: string[] };
};

const VALID_DDDS = new Set([
  '11', '12', '13', '14', '15', '16', '17', '18', '19',
  '21', '22', '24',
  '27', '28',
  '31', '32', '33', '34', '35', '37', '38',
  '41', '42', '43', '44', '45', '46',
  '47', '48', '49',
  '51', '53', '54', '55',
  '61', '62', '63', '64', '65', '66', '67',
  '68', '69',
  '71', '73', '74', '75', '77', '79',
  '81', '82', '83', '84', '85', '86', '87', '88', '89',
  '91', '92', '93', '94', '95', '96', '97', '98', '99',
])

const formSchema = object({
  nome: string()
    .default('')
    .required("Preencha seu nome corretamente.")
    .matches(/^[A-Za-zÀ-ÿ\s]+$/, "O nome deve conter apenas letras."),

  telefone: string()
    .default('')
    .required("Preencha seu telefone corretamente.")
    .matches(/^[0-9()+-\s]+$/, "O telefone deve conter apenas números.")
    .test('telefone-digitos', 'Preencha seu telefone corretamente.', (value) => {
      if (!value) return false

      const digits = value.replace(/\D/g, '')
      return digits.length === 10 || digits.length === 11
    })
    .test('telefone-ddd', 'DDD inválido. Informe um DDD brasileiro válido.', (value) => {
      if (!value) return false

      const digits = value.replace(/\D/g, '')
      if (digits.length < 2) return false

      const ddd = digits.slice(0, 2)
      return VALID_DDDS.has(ddd)
    }),

  email: string()
    .default('')
    .email("E-mail precisa ser válido.")
    .required("Preencha seu e-mail corretamente."),

  profissao: string().default(''),
  veiculo: string().default(''),
  estado: string().default(''),
  renda: string().default(''),
});

export function Subscribe() {
  const navigate = useNavigate()
  const isMobile = useMediaQuery({ query: `(min-width: 1140px)` });
  const [erros, setErros] = useState<FormErrors>({})
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState<FormProps>({
    nome: "",
    profissao: "",
    telefone: "",
    email: "",
    renda: "",
    estado: "",
    veiculo: "",
  })

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11)

    if (digits.length <= 2) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  function handleChangeStep() {
    formSchema
      .validateAt(FormSteps[step].name, { [FormSteps[step].name]: FormSteps[step].text })
      .then(() => {
        setErros((prev) => ({ ...prev, [FormSteps[step].name]: '' }))
        setStep(e => e + 1)
      })
      .catch((error: ValidationError) => {
        setErros((prev) => ({ ...prev, [FormSteps[step].name]: error.message }))
      })
  }

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

  function handleSelectValue(value: string) {
    setForm({
      ...form,
      [SelectSteps[step].name]: value,
    })
  }

  function handleEnterToContinue(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') return

    event.preventDefault()

    if (step === 6) {
      if (isSubmitting) return
      logon()
      return
    }

    handleChangeStep()
  }

  function logon() {
    if (isSubmitting) return

    formSchema.validate( form, { abortEarly: false } )
    .then(() => {
        setErros({
          nome: "",
          telefone: "",
          email: "",
          renda: "",
          estado: "",
          veiculo: "",
          profissao: "",
        })
        setIsSubmitting(true)
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

    async function sendForm() {
    try {
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

      await Promise.all([response1, response2]);

      navigate('/obrigado', { state: { fromSubscribe: true } });
    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
      alert("Erro ao realizar cadastro. Tente novamente.")
      setIsSubmitting(false)
    }
  }

  const FormSteps: MyObjectFormType = {
    0: {
      label: "Nome completo *",
      name: "nome",
      placeholder: "Digite seu nome aqui",
      text: form.nome,
      erro: erros.nome
    },
    1: {
      label: "Telefone *",
      name: "telefone",
      placeholder: "Digite seu telefone aqui",
      text: form.telefone,
      erro: erros.telefone
    },
    2: {
      label: "Email *",
      name: "email",
      placeholder: "Digite seu email aqui",
      text: form.email,
      erro: erros.email
    },
    3: {
      label: "Veículo",
      name: "veiculo",
      placeholder: "Digite seu veiculo aqui",
      text: form.veiculo,
      erro: ""
    },
    4: {
      label: "Profissão",
      name: "profissao",
      placeholder: "Digite sua profissão",
      text: form.profissao,
      erro: ""
    },
    5: {
      label: "Estado civil",
      name: "estado",
      placeholder: "Digite seu estado civil aqui",
      text: form.estado,
      erro: ""
    },
    6: {
      label: "Renda familiar",
      name: "renda",
      placeholder: "Digite sua renda aqui",
      text: form.renda,
      erro: erros.renda
    },
  };

  const SelectSteps: MyObjectSelectType = {
    5: {
      label: "Estado civil",
      name: "estado",
      placeholder: "Selecione seu estado civil",
      options: ["Solteiro", "Casado", "Divorciado", "Viúvo", "União Estável"],
    },
    6: {
      label: "Renda familiar",
      name: "renda",
      placeholder: "Selecione sua renda",
      options: ["Entre R$1.000 e R$3.000", "Entre R$4.000 e R$7.000", "Entre R$8.000 em Diante"]
    }
  }

  const totalSteps = 7;
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  return (
        <div className='subscribe'>
          <div className='form'>
        {
          isMobile && (<div className='morfologia-left-subscribe'>
          <img className='morfologia-subscribe' src={morfologia1} />
        </div>)
        }
          <div className='content-subscribe'>
            {
              step < 5 && (
                <TextField
                  label={FormSteps[step].label}
                  name={FormSteps[step].name}
                  text={FormSteps[step].text?.toString() || ''}
                  placeholder={FormSteps[step].placeholder} errorMessage={FormSteps[step].erro}
                  onKeyDown={handleEnterToContinue}
                  onChange={(e) =>
                    {
                      if (step == 0) {
                        setForm({
                          ...form,
                          [FormSteps[step].name]: e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, ""),
                        })
                      }
                      else if (step == 1) {
                            setForm({
                          ...form,
                          [FormSteps[step].name]: formatPhone(e.target.value),
                        })
                      }
                      else {
                        setForm({
                          ...form,
                          [FormSteps[step].name]: e.target.value,
                        })
                      }
                    }
                  }
                  onBlur={(e) => validateField(FormSteps[step].name as keyof FormProps, e.target.value)}
              />
              )
            }

            {
              step >= 5 && (
                <Select onClick={handleSelectValue} label={SelectSteps[step].label} options={SelectSteps[step].options} form={form} />
              )
            }
          <div className='div-button-subscribe'>
            <Button text={step == 6 && isSubmitting ? 'CADASTRANDO...' : step == 6 ? 'CADASTRAR' : 'AVANÇAR'} disabled={step == 6 && isSubmitting} onClick={step == 6 ? logon : handleChangeStep} />
          </div>
        </div>
        {
          isMobile && (<div className='morfologia-right-subscribe'>
          <img className='morfologia-subscribe' src={morfologia2} />
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
      <div className='progress-container'>
        <div className='progress-bar' style={{ width: `${progress}%` }}></div>
        <div className='progress-text'>{progress}% concluído</div>
      </div>
        </div>
  )
}
