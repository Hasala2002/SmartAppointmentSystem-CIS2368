import { Container, Group, Anchor, Text, Box } from '@mantine/core'

export const Footer = () => {
  return (
    <Box component="footer" h={60} display="flex" style={{ alignItems: 'center', borderTop: '1px solid #e9ecef', backgroundColor: 'white' }}>
      <Container size="lg" h="100%" display="flex" style={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Text size="sm">© 2026 Smile Dental Group. All rights reserved.</Text>
        <Group gap="lg">
          <Anchor href="#" size="sm">
            About
          </Anchor>
          <Anchor href="#" size="sm">
            Contact
          </Anchor>
          <Anchor href="#" size="sm">
            Privacy Policy
          </Anchor>
        </Group>
      </Container>
    </Box>
  )
}
