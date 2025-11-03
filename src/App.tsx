import './App.css'
import { NavBar } from './components/NavBar'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Home } from './pages/Home';
import { Subscribe } from './pages/Subscribe';
import { NotFound } from './pages/NotFound';

function App() {

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/cadastro" Component={Subscribe} />
        <Route path="*" Component={NotFound} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
