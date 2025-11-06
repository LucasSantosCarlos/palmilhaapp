import * as React from "react";

import { useTheme } from "@/src/provider/ThemeProvider";
import { Text, TextProps, View, ViewProps } from "react-native";

function Card({ ...props }: ViewProps) {
  const {theme} = useTheme();
  return (
    <View
      style={{ borderRadius: 8, backgroundColor: theme.boxBackground, borderWidth: 1, borderColor: theme.gray300 }}
      {...props}
    />
  );
}

function CardHeader({ ...props }: ViewProps) {
  const {theme} = useTheme();
  return (
    <View
      style={{ padding: 16 }}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: TextProps) {
  const {theme} = useTheme();
  return (
    <Text
      style={{ fontSize: 18, fontWeight: '700', marginBottom: 4, color: theme.text }}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: TextProps) {
  const {theme} = useTheme();
  return (
    <Text
      style={{ fontSize: 14, color: theme.textGray }}
      {...props}
    />
  );
}


function CardContent({ className, ...props }: ViewProps) {
  return (
    <View
      style={{ padding: 16 }}
      {...props}
    />
  );
}

export {
  Card, CardContent, CardDescription, CardHeader, CardTitle
};

