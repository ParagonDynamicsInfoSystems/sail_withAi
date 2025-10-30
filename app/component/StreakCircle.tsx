// app/component/StreakCircle.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ViewStyle,
  TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  value?: string | number;
  size?: number;
  backgroundImage?: any;
};

export default function StreakCircle({ value = "7", size = 84, backgroundImage }: Props) {
  const ring = Math.round(size * 0.07);
  const inner = size - ring * 2;

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    alignItems: "center",
    justifyContent: "center",
  };

  const innerStyle: ViewStyle = {
    width: inner,
    height: inner,
    borderRadius: inner / 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

  const numberStyle: TextStyle = {
    fontFamily: "RubikOne",
    fontSize: Math.round(size * 0.38),
    color: "#1A4B86",
    textAlign: "center",
    lineHeight: Math.round(size * 0.42),
  };

  return (
    <View style={[containerStyle, styles.outerRing]}>
      <View
        style={[
          { width: size, height: size, borderRadius: size / 2, borderWidth: ring, borderColor: "#FFFFFF" },
          styles.shadow,
        ]}
      />

      <View style={[styles.innerWrap, innerStyle]}>
        {backgroundImage ? (
          <ImageBackground
            source={backgroundImage}
            style={[styles.abs, innerStyle]}
            imageStyle={{ borderRadius: inner / 2 }}
          >
            <View style={[styles.gloss, { width: inner, height: inner, borderRadius: inner / 2 }]} />
            <View style={styles.numberWrap}>
              {[-1, 1].map((x) =>
                [-1, 1].map((y, idx) => (
                  <Text
                    key={idx}
                    style={[
                      numberStyle,
                      styles.outline,
                      { transform: [{ translateX: x }, { translateY: y }] },
                    ]}
                  >
                    {value}
                  </Text>
                ))
              )}
              <Text style={numberStyle}>{value}</Text>
            </View>
          </ImageBackground>
        ) : (
          <LinearGradient
            colors={["#66a7ff", "#2e7ae6"]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={[styles.abs, innerStyle]}
          >
            <View
              style={[
                styles.abs,
                { borderRadius: inner / 2, opacity: 0.08, backgroundColor: "#ffffff" },
              ]}
            />
            <View style={styles.numberWrap}>
              {[-1, 1].map((x) =>
                [-1, 1].map((y, idx) => (
                  <Text
                    key={idx}
                    style={[
                      numberStyle,
                      styles.outline,
                      { transform: [{ translateX: x }, { translateY: y }] },
                    ]}
                  >
                    {value}
                  </Text>
                ))
              )}
              <Text style={numberStyle}>{value}</Text>
            </View>
          </LinearGradient>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerRing: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  shadow: {
    position: "absolute",
    top: 0,
    left: 0,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  innerWrap: {
    position: "relative",
    overflow: "hidden",
  },
  abs: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  gloss: {
    position: "absolute",
    left: -10,
    top: -10,
    width: "55%",
    height: "55%",
    backgroundColor: "#ffffff",
    opacity: 0.08,
    transform: [{ rotate: "-20deg" }],
  },
  numberWrap: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  outline: {
    color: "#ffffff",
    position: "absolute",
    textAlign: "center",
    includeFontPadding: false,
    fontWeight: "700" as TextStyle["fontWeight"],
  },
});
