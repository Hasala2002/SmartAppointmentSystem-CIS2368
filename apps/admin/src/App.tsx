import { MantineProvider } from '@mantine/core'
import { BrowserRouter } from 'react-router-dom'
import '@mantine/core/styles.css'

function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <div style={{ padding: '20px' }}>
          <h1>Admin Dashboard</h1>
          <p>Admin panel is running on port 5174</p>
        </div>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App
