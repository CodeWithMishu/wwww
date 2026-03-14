import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "../../src/components/Screen";
import { Card } from "../../src/components/Card";
import { theme } from "../../src/theme";
import { useAppStore } from "../../src/store/useAppStore";

export default function LoginScreen() {
  const users = useAppStore((state) => state.users);
  const companies = useAppStore((state) => state.companies);
  const loginAs = useAppStore((state) => state.loginAs);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError("Enter your email and password.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    const matchedUser = users.find(
      (user) => user.email.trim().toLowerCase() === normalizedEmail
    );
    if (!matchedUser || matchedUser.password !== password) {
      setError("Invalid email or password.");
      return;
    }
    const company = companies.find((item) => item.id === matchedUser.companyId);
    if (company && !company.active) {
      setError("This company is suspended. Contact your administrator.");
      return;
    }
    if (!matchedUser.active) {
      setError("This account is inactive. Contact your administrator.");
      return;
    }
    setError("");
    loginAs(matchedUser.id);
    router.replace("/dashboard");
  };

  return (
    <Screen padded={false} scroll={false}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.brand}>Warehouse WMS</Text>
          <Text style={styles.subtitle}>Enterprise Control Center</Text>
          <Text style={styles.caption}>
            Sign in with your assigned email and password to access your role-based
            workspace.
          </Text>
        </View>
        <Card style={styles.card}>
          <Text style={styles.title}>Sign in</Text>
          <TextInput
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (error) {
                setError("");
              }
            }}
            placeholder="Email address"
            placeholderTextColor={theme.colors.inkSubtle}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            style={styles.input}
          />
          <View style={styles.passwordRow}>
            <TextInput
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (error) {
                  setError("");
                }
              }}
              placeholder="Password"
              placeholderTextColor={theme.colors.inkSubtle}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
              onSubmitEditing={handleLogin}
              style={[styles.input, styles.passwordInput]}
            />
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.passwordToggle}
            >
              <Text style={styles.passwordToggleText}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </Pressable>
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed
            ]}
          >
            <Text style={styles.primaryText}>Login</Text>
          </Pressable>
          <Text style={styles.helpText}>
            Admins and super admins manage access, roles, and permissions.
          </Text>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    justifyContent: "center",
    gap: theme.spacing.lg
  },
  hero: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.xs
  },
  brand: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.ink
  },
  subtitle: {
    fontSize: 13,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: theme.colors.inkSubtle
  },
  caption: {
    marginTop: theme.spacing.sm,
    fontSize: 13,
    textAlign: "center",
    color: theme.colors.inkSubtle
  },
  card: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 420,
    padding: theme.spacing.lg
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.ink,
    marginBottom: theme.spacing.md
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 14,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm
  },
  passwordInput: {
    flex: 1,
    marginBottom: 0
  },
  passwordToggle: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceMuted
  },
  passwordToggleText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.ink
  },
  error: {
    marginTop: theme.spacing.sm,
    fontSize: 12,
    color: theme.colors.danger
  },
  primaryButton: {
    marginTop: theme.spacing.md,
    alignItems: "center",
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm
  },
  primaryButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }]
  },
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "700"
  },
  helpText: {
    marginTop: theme.spacing.sm,
    fontSize: 12,
    textAlign: "center",
    color: theme.colors.inkSubtle
  }
});
