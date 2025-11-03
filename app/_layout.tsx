import { darkTheme, theme } from "@/theme";
import { ThemeProvider } from "@shopify/restyle";
import { Stack } from "expo-router";
import { useState } from "react";
import { Switch } from "react-native";
import { Box, Text } from "./components/RestyleComponents";

export default function RootLayout() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : theme}>
      <Stack />
      <Box
        backgroundColor="primaryCardBackground"
        margin="s"
        padding="m"
        flexGrow={1}
      >
        <Text variant="body" color="primaryCardText">
          Primary Card
        </Text>
      </Box>
      <Box
        backgroundColor="secondaryCardBackground"
        margin="s"
        padding="m"
        flexGrow={1}
      >
        <Text variant="body" color="secondaryCardText">
          Secondary Card
        </Text>
      </Box>
      <Box marginTop="m">
        <Switch
          value={darkMode}
          onValueChange={(value: boolean) => setDarkMode(value)}
        />
      </Box>
    </ThemeProvider>
  );
}
