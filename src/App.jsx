import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<h1>Welcom FU.OHAYO</h1>} />
      </Route>
    </Routes>
  )
}

export default App