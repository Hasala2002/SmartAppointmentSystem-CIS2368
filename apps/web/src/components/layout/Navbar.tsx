import { Group, Button, Menu, Avatar, Container, Box } from '@mantine/core'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Box component="nav" h={60} display="flex" style={{ alignItems: 'center', borderBottom: '1px solid #e9ecef', backgroundColor: 'white' }}>
      <Container size="lg" h="100%" display="flex" style={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: 'teal' }}>
            🦷 Smile Dental
          </div>
        </RouterLink>

        <Group gap="md">
          {user ? (
            <>
              <Button variant="subtle" component={RouterLink} to="/dashboard">
                Dashboard
              </Button>
              <Button variant="subtle" component={RouterLink} to="/book">
                Book
              </Button>
              <Menu>
                <Menu.Target>
                  <Avatar color="teal" radius="xl" style={{ cursor: 'pointer' }}>
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </Avatar>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item disabled>
                    {user.firstName} {user.lastName}
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          ) : (
            <>
              <Button variant="default" component={RouterLink} to="/login">
                Login
              </Button>
              <Button component={RouterLink} to="/register">
                Sign Up
              </Button>
            </>
          )}
        </Group>
      </Container>
    </Box>
  )
}
