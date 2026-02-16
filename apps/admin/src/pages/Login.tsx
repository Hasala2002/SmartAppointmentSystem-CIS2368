import {
  Center,
  Paper,
  Stack,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Group,
  Checkbox,
} from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, LockClosedOutline } from "react-ionicons";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Login attempt:", { email, password, rememberMe });
    navigate("/");
  };

  return (
    <Center
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--mantine-color-gray-9)",
      }}
    >
      <Paper p="xl" radius="lg" style={{ width: "100%", maxWidth: 420 }}>
        <Stack gap="lg">
          <Group justify="center">
            <LockClosedOutline
              color="var(--mantine-color-teal-6)"
              style={{ width: 36, height: 36 }}
            />
          </Group>
          <Stack gap={0} style={{ textAlign: "center" }}>
            <Title order={2}>Smile Dental</Title>
            <Text c="dimmed" size="sm">
              Admin Portal
            </Text>
          </Stack>

          <form onSubmit={onSubmit}>
            <Stack gap="md">
              <TextInput
                label="Email Address"
                placeholder="admin@smiledental.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                error={errors.email}
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                error={errors.password}
              />

              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.currentTarget.checked)}
                label="Remember me"
                size="sm"
              />

              <Button type="submit" fullWidth color="teal" size="md">
                Sign In
              </Button>
            </Stack>
          </form>

          <Group justify="center">
            <Button
              variant="subtle"
              c="teal"
              size="xs"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Center>
  );
};

export { Login };
