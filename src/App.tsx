import { useEffect} from 'react'
import reactLogo from './assets/react.svg'
import { initializeFirebaseApp } from './firebase'
// import './App.css'


function App() {
  const showMessages = (payload:MessageEvent) => {
    console.log('firebase foreground message', payload)
  }

  useEffect(() => {
    initializeFirebaseApp()

    navigator.serviceWorker?.addEventListener('message',showMessages)

    return () => {
      navigator.serviceWorker?.removeEventListener('message',showMessages)
    }
  }, [])

  return (
    <>
      <div>
          <img src={reactLogo} className="logo react" alt="React logo" />
      </div>
      <h1>Test Firebase messages</h1>
    </>
  )
}

export default App
