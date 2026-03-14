import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { theme } from "../theme";

type ScreenProps = {
  children: React.ReactNode;
  padded?: boolean;
  scroll?: boolean;
};

export const Screen = ({ children, padded = true, scroll = true }: ScreenProps) => {
  return (
    <SafeAreaView style={styles.safe}>
      {scroll ? (
        <ScrollView contentContainerStyle={[styles.content, padded && styles.padded]}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, padded && styles.padded]}>{children}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  content: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center"
  },
  padded: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg
  }
});
