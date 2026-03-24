import { Group, Button, Menu, Avatar, Container, Box, Image, Text, Burger, Drawer, Stack } from "@mantine/core";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpened, setMenuOpened] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box
      component="nav"
      h={60}
      display="flex"
      style={{
        alignItems: "center",
        borderBottom: "1px solid #e9ecef",
        backgroundColor: "white",
      }}
    >
      <Container
        size="lg"
        h="100%"
        display="flex"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <RouterLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Group gap="sm">
            <Image src="/logo.png" alt="Lone Star Dental Logo" h={25} w={25} fit="contain" />
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "teal" }}>
              Lone Star Dental
            </Text>
          </Group>
        </RouterLink>

        <Group gap="md" hide={{ base: "xs", sm: "xs", md: "none" }}>
          {/* Desktop menu */}
          {user ? (
            <>
              <Button variant="subtle" component={RouterLink} to="/dashboard">
                Dashboard
              </Button>
              <Button variant="subtle" component={RouterLink} to="/book">
                Book
              </Button>
              <Button variant="subtle" component={RouterLink} to="/queue">
                Queue Status
              </Button>
              <Menu>
                <Menu.Target>
                  <Avatar
                    color="teal"
                    radius="xl"
                    style={{ cursor: "pointer" }}
                  >
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

        {/* Mobile burger menu */}
        <Burger
          opened={menuOpened}
          onClick={() => setMenuOpened(!menuOpened)}
          hiddenFrom="md"
          size="sm"
        />
      </Container>

      {/* Mobile drawer */}
      <Drawer
        opened={menuOpened}
        onClose={() => setMenuOpened(false)}
        title="Menu"
        position="right"
        size="xs"
      >
        <Stack gap="md">
          {user ? (
            <>
              <Button
                fullWidth
                variant="subtle"
                component={RouterLink}
                to="/dashboard"
                onClick={() => setMenuOpened(false)}
              >
                Dashboard
              </Button>
              <Button
                fullWidth
                variant="subtle"
                component={RouterLink}
                to="/book"
                onClick={() => setMenuOpened(false)}
              >
                Book
              </Button>
              <Button
                fullWidth
                variant="subtle"
                component={RouterLink}
                to="/queue"
                onClick={() => setMenuOpened(false)}
              >
                Queue Status
              </Button>
              <Button
                fullWidth
                color="red"
                variant="light"
                onClick={() => {
                  setMenuOpened(false);
                  handleLogout();
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                fullWidth
                variant="default"
                component={RouterLink}
                to="/login"
                onClick={() => setMenuOpened(false)}
              >
                Login
              </Button>
              <Button
                fullWidth
                component={RouterLink}
                to="/register"
                onClick={() => setMenuOpened(false)}
              >
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Drawer>
    </Box>
  );
};
