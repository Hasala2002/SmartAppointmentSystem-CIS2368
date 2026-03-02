import {
  Group,
  Burger,
  Text,
  Select,
  ActionIcon,
  Menu,
  Avatar,
  Indicator,
  Paper,
  useMantineTheme,
  Image,
} from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Notifications, LogOut } from "react-ionicons";
import { LOCATIONS } from "../../types";
import { useAuthStore } from "../../stores/authStore";

interface HeaderProps {
  opened: boolean;
  toggle: () => void;
}

export function Header({ opened, toggle }: HeaderProps) {
  const theme = useMantineTheme();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(
    "all",
  );
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const locationOptions = [
    { value: "all", label: "All Locations" },
    ...LOCATIONS.map((loc) => ({ value: loc.id, label: loc.name })),
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Group h="100%" px="md" justify="space-between">
      {/* Left Side */}
      <Group gap={0}>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Group gap="sm">
          <Image src="/logo.png" alt="Lone Star Dental Logo" h={25} w={25} fit="contain" />
          <Text fw={600} size="lg">
            Lone Star Dental Admin
          </Text>
        </Group>
      </Group>

      {/* Center - Location Selector */}
      <Select
        placeholder="Select location"
        data={locationOptions}
        value={selectedLocation}
        onChange={setSelectedLocation}
        searchable
        clearable={false}
        style={{ minWidth: 200 }}
        hiddenFrom="sm"
      />

      {/* Right Side */}
      <Group gap="lg">
        {/* Notifications */}
        <ActionIcon variant="subtle" color="gray" size="lg" pos="relative">
          <Notifications color="currentColor" />
          <Indicator color="red" size={8} offset={-5} position="top-end" />
        </ActionIcon>

        {/* Admin Menu */}
        <Menu position="bottom-end" shadow="md">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray" size="lg">
              <Avatar size={28} radius="xl" color="teal">
                AD
              </Avatar>
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item disabled>Admin Profile</Menu.Item>
            <Menu.Divider />
            <Menu.Item
              onClick={handleLogout}
              leftSection={<LogOut size="16px" />}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}
