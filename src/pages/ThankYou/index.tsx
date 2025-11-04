import './index.css'
import morfologia1 from '../../assets/morfologia-1.png'
import morfologia2 from '../../assets/morfologia-2.png'
import morfologiaBottom from '../../assets/morfologia-mobile.png'
import { useMediaQuery } from 'react-responsive';

export function ThankYou() {
  const isMobile = useMediaQuery({ query: `(min-width: 900px)` });

  return (
    <div className='thank-you'>
      <div className="banner-thank-you">
      {
        isMobile && (
          <div className='morfologia-left-thank-you'>
        <img className='morfologia-thank-you' src={morfologia1} />
      </div>
        )
      }
      <div className='content-thank-you'>
        <div className='text-thank-you'>
          <div className='success-icon'>
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" stroke="url(#gradient)" strokeWidth="4"/>
              <path d="M30 50L43 63L70 36" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C0390B"/>
                  <stop offset="100%" stopColor="#E76B00"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className='copy-thank-you biggest-thank-you'>CADASTRO REALIZADO COM SUCESSO!</p>
          <p className='copy-thank-you smallest-thank-you'>
            Obrigado por se inscrever! Em breve entraremos em contato com mais informações sobre o Vale das Minas Park.
          </p>
          <p className='copy-thank-you medium-thank-you'>
            Fique atento ao seu e-mail e telefone para não perder nenhuma novidade!
          </p>
        </div>
      </div>
      {
        isMobile && (
        <div className='morfologia-right-thank-you'>
          <img className='morfologia-thank-you' src={morfologia2} />
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
