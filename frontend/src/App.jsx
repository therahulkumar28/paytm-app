import {BrowserRouter , Route ,Routes} from 'react-router-dom'
import {Signup} from './pages/Signup'
import {Signin} from './pages/Signin'
import {Dashboard} from './pages/Dashboard'
import {SendMoney} from './pages/Sendmoney'
import TransactionSuccessfull from './pages/Transactionsuccesful'
function App() {

  return (
   <>
   <BrowserRouter>
   <Routes>
    <Route path="/signup" element={<Signup/>} />
    <Route path="/signin" element={<Signin/>} />
    <Route path="/dashboard" element={<Dashboard/>} />
    <Route path="/send" element={<SendMoney/>} />
    <Route path="/transactionsuccessfull" element={<TransactionSuccessfull/>} />
   </Routes>
   </BrowserRouter>
   </>
  )
}

export default App
