import './App.css';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Authentication from './pages/Authentication';
import { AuthProvider } from './contexts/AuthContext';
import VideoMeet from './pages/VideoMeet';
import Home from './pages/Home';

function App() {

  return (
    <>
    <Router>
      <AuthProvider>

    <Routes>
      <Route path='/' element = {<LandingPage />} ></Route>

      <Route path='/auth' element = {<Authentication />} ></Route>
      <Route path='/home' element= {<Home />}></Route>

      <Route path='/:url' element = {<VideoMeet />} ></Route>

    </Routes>

    </AuthProvider>

    </Router>
    </>
  )
}

export default App
