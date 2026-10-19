import { useEffect, useState } from 'react'
import Khishig from './demos/Khishig.jsx'
import YbcCatering from './demos/YbcCatering.jsx'

export default function App() {
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  if (hash === '#khishig') return <Khishig />
  return <YbcCatering />
}
