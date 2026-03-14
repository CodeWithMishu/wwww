import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "../../src/components/Screen";
import { Card } from "../../src/components/Card";
import { FormField } from "../../src/components/FormField";
import { theme } from "../../src/theme";
import { useAppStore } from "../../src/store/useAppStore";
import { useUiStore } from "../../src/store/useUiStore";

export default function LoginScreen() {
  const users = useAppStore((state) => state.users);
  const companies = useAppStore((state) => state.companies);
  const loginAs = useAppStore((state) => state.loginAs);
  const showToast = useUiStore((state) => state.showToast);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError("Enter your email and password.");
      showToast("Enter your email and password.", "warning");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      showToast("Enter a valid email address.", "warning");
      return;
    }
    const matchedUser = users.find(
      (user) => user.email.trim().toLowerCase() === normalizedEmail
    );
    if (!matchedUser || matchedUser.password !== password) {
      setError("Invalid email or password.");
      showToast("Invalid email or password.", "danger");
      return;
    }
    const company = companies.find((item) => item.id === matchedUser.companyId);
    if (company && !company.active) {
      setError("This company is suspended. Contact your administrator.");
      showToast("Company is suspended. Contact your administrator.", "warning");
      return;
    }
    if (!matchedUser.active) {
      setError("This account is inactive. Contact your administrator.");
      showToast("This account is inactive.", "warning");
      return;
    }
    setError("");
    loginAs(matchedUser.id);
    showToast(`Welcome back, ${matchedUser.name}.`, "success");
    router.replace("/dashboard");
  };

  return (
    <Screen padded={false} scroll={false}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Image
            source={require("../../logo1.png")}
            style={styles.loginLogo}
            resizeMode="contain"
            accessible
            accessibilityLabel="Mindbridge Innovations logo"
          />
        </View>
        <Card style={styles.card}>
          <Text style={styles.title}>Sign in</Text>
          <FormField label="Email" error={error ? " " : undefined}>
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
              accessibilityLabel="Email address"
              style={styles.input}
            />
          </FormField>
          <FormField label="Password" error={error}>
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
                accessibilityLabel="Password"
                style={[styles.input, styles.passwordInput]}
              />
              <Pressable
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.passwordToggle}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              >
                <Text style={styles.passwordToggleText}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </Pressable>
            </View>
          </FormField>
          <Pressable
            onPress={handleLogin}
            accessibilityRole="button"
            accessibilityLabel="Login"
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
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xl,
    justifyContent: "center",
    gap: theme.spacing.xl
  },
  hero: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm
  },
  loginLogo: {
    width: 360,
    height: 170,
    maxWidth: "100%"
  },
  caption: {
    marginTop: theme.spacing.sm,
    fontSize: 13,
    fontFamily: theme.typography.body,
    textAlign: "center",
    color: theme.colors.inkSubtle,
    lineHeight: 20,
    maxWidth: 560
  },
  card: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 420,
    padding: theme.spacing.lg,
    borderColor: theme.colors.borderStrong,
    backgroundColor: "rgba(255,255,255,0.94)"
  },
  title: {
    fontSize: 19,
    fontFamily: theme.typography.heading,
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
    fontFamily: theme.typography.body,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceMuted
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
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceMuted
  },
  passwordToggleText: {
    fontSize: 12,
    fontFamily: theme.typography.body,
    fontWeight: "700",
    color: theme.colors.accentDark,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  primaryButton: {
    marginTop: theme.spacing.md,
    alignItems: "center",
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    borderRadius: theme.radius.pill,
    shadowColor: theme.colors.shadowStrong,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 4
  },
  primaryButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }]
  },
  primaryText: {
    color: "#FFFFFF",
    fontFamily: theme.typography.body,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  helpText: {
    marginTop: theme.spacing.sm,
    fontSize: 12,
    fontFamily: theme.typography.body,
    textAlign: "center",
    color: theme.colors.inkSubtle
  }
});
