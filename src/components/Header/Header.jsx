import './Header.css'
import BankApp from '../Bank/BankApp';
import BudgetApp from '../Budget/BudgetApp';
import LogIn from '../LogIn/LogIn';
import { useState } from 'react';
import logo from '../../assets/images/blue-logo-azure-bank.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'



function Header() {
  const [showBank, setShowBank] = useState(true);
  const [showBudget, setShowBudget] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [color1, setColor1] = useState('button-blue2');
  const [color2, setColor2] = useState('button-blue1');
  const [color3, setColor3] = useState('button-red1');


  return (
    <div className="body">
      { showHeader &&
      <div className="navigation">
        <div className="left-navigation">
          <img src={logo} alt="Azure Bank Logo" className='azure-logo' style={{width: 200}}/>
          {/* <p>Hi, John Doe, Welcome Back!</p> */}
        </div>
        <div className="right-navigation">
          <button className={color1} onClick={() => {setShowBank(true); setShowBudget(false); setShowLogout(false);setColor1('button-blue2'); setColor2('button-blue1'); setColor3('button-red1')}}>Banking App</button>
          <button className={color2} onClick={() => {setShowBudget(true); setShowBank(false); setShowLogout(false);setColor1('button-blue1'); setColor2('button-blue2'); setColor3('button-red1')}}>Budget App</button>
          {/* <button className={color3} onClick={() => {setShowLogout(true); setShowBudget(false); setShowBank(false); setShowHeader(false);setColor1('button-blue1'); setColor2('button-blue1'); setColor3('button-red2')}}><FontAwesomeIcon icon={faArrowRightFromBracket} /></button> */}
        </div>
      </div>
      }
      { showBank &&
        <BankApp />
      }
      { showBudget &&
        <BudgetApp />
      }
      {/* { showLogout &&
        <LogIn />
      } */}
    </div>
  )
}

export default Header