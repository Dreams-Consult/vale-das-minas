import './index.css'
import { Button } from "../../components/Button";
import { useNavigate, useLocation } from 'react-router'
import morfologia1 from '../../assets/morfologia-1.png'
import morfologia2 from '../../assets/morfologia-2.png'
import morfologiaBottom from '../../assets/morfologia-mobile.png'
import { useMediaQuery } from 'react-responsive';
import { useEffect } from 'react';

export function ThankYou() {
  const isMobile = useMediaQuery({ query: `(min-width: 900px)` });
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!location.state?.fromSubscribe) {
      navigate('/', { replace: true })
    }
  }, [location, navigate])

  return (
    <div className='thank-you'>
      <div className="banner-thank-you">
      {
        isMobile && (
          <div className='morfologia-left'>
            <img className='morfologia' src={morfologia1} />
          </div>
        )
      }
      <div className='content-thank-you'>
        <div className='text-thank-you'>
          <p className='copy-thank-you biggest-thank-you'>OBRIGADO POR SE CADASTRAR!</p>
          <p className='copy-thank-you smallest-thank-you'>
            Seu cadastro foi realizado com sucesso! 
            Em breve entraremos em contato com mais informações sobre este projeto incrível.
          </p>
          <p className='copy-thank-you smallest-thank-you'>
            Fique atento ao seu e-mail e telefone para não perder nenhuma novidade!
          </p>
        </div>
        <div className='div-button-thank-you'>
          <Button text="VOLTAR PARA HOME" onClick={() => navigate('/')} />
        </div>
      </div>
      {
        isMobile && (
          <div className='morfologia-right'>
            <img className='morfologia' src={morfologia2} />
          </div>
        )
      }
    </div>

    {
        !isMobile &&
        (
          <div className='rodape-banner-thank-you'>
            <img className='morfologia-bottom-thank-you' src={morfologiaBottom} width={'90%'} />
          </div>
        )
      }
    </div>
  )
}
