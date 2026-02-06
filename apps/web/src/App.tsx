import { MantineProvider } from '@mantine/core'
import { BrowserRouter } from 'react-router-dom'
import '@mantine/core/styles.css'

function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <div style={{ padding: '20px' }}>
          <h1>Appointment System</h1>
          <p>Frontend is running on port 5173</p>
        </div>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App
