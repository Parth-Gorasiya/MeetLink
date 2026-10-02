import './App.css';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Authentication from './pages/Authentication';
import { AuthProvider } from './contexts/AuthContext';

function App() {

  return (
    <>
    <Router>
      <AuthProvider>

    <Routes>
      <Route path='/' element = {<LandingPage />} ></Route>

      <Route path='/auth' element = {<Authentication />} ></Route>
    </Routes>

    </AuthProvider>

    </Router>
    </>
  )
}

export default App
