import { Container, Group, Anchor, Text, Box, Stack } from "@mantine/core";

export const Footer = () => {
  return (
    <Box
      component="footer"
      py="md"
      display="flex"
      style={{
        alignItems: "center",
        borderTop: "1px solid #e9ecef",
        backgroundColor: "white",
      }}
    >
      <Container
        size="lg"
        display="flex"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <Text size="sm" ta={{ base: "center", sm: "left" }}>
          © 2026 Lone Star Dental Group. All rights reserved.
        </Text>
        <Group gap="lg" justify="center">
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
  );
};
