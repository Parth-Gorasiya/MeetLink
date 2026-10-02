import './App.css';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Authentication from './pages/Authentication';

function App() {

  return (
    <>
    <Router>

    <Routes>
      <Route path='/' element = {<LandingPage />} ></Route>

      <Route path='/auth' element = {<Authentication />} ></Route>
    </Routes>

    </Router>
    </>
  )
}

export default App
