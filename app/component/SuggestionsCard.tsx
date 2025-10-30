// app/components/SuggestionsCarousel.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
  LayoutChangeEvent,
} from "react-native";

const BLUE = "#0D47A1";

const SUGGESTIONS = [
  "I know you are pushing hard. Let's compensate with few more phone calls today?",
  "There seems to be no plan for this week.. Can I make one for you?",
  "Focus on top 20% leads — shall I prioritise outreach now?",
  "You have 5 missed follow-ups — want me to remind you?",
];

export default function SuggestionsCarousel() {
  const window = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [cardInnerWidth, setCardInnerWidth] = useState<number | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);

  // when the card measures its inner width we set it
  function onCardLayout(e: LayoutChangeEvent) {
    const w = e.nativeEvent.layout.width;
    setCardInnerWidth(w);
  }

  // compute slide width; if not measured yet, fallback to window minus paddings
  const slideWidth = cardInnerWidth ?? Math.min(520, window.width - 36);

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const x = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(x / slideWidth);
    if (newIndex !== index) setIndex(newIndex);
  }

  function goTo(i: number) {
    scrollRef.current?.scrollTo({ x: i * slideWidth, animated: true });
    setIndex(i);
  }

  return (
    <View style={styles.card} onLayout={onCardLayout}>
      {/* Header */}
      <View style={styles.suggHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.iconWrap}>
            <Image
              source={require("../../assets/images/Fire blue.png")}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.cardTitle}>Suggestions</Text>
        </View>

        <TouchableOpacity style={styles.generateBtn} activeOpacity={0.88}>
          <Text style={styles.generateTxt}>⚡ Generate more</Text>
        </TouchableOpacity>
      </View>

      {/* pager only renders when we know slide width or use fallback */}
      <View style={{ marginTop: 12 }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          snapToInterval={slideWidth}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingRight: 6 }}
        >
          {SUGGESTIONS.map((s, i) => (
            <View
              key={i}
              style={[
                styles.slide,
                { width: slideWidth, paddingHorizontal: 14 }, // ensure inner padding
              ]}
            >
              <Text style={styles.suggText}>{s}</Text>

              {/* divider */}
              <View style={styles.divider} />

              {/* prompt + yes/no on the right */}
              <View style={styles.promptRow}>
                <Text style={styles.promptText}>
                  Would like AI to generate workflows with it?
                </Text>

                <View style={styles.yesNoRow}>
                  <Pressable style={[styles.smallPill, styles.smallPillYes]}>
                    <Text style={[styles.smallPillText, styles.smallPillTextYes]}>Yes</Text>
                  </Pressable>

                  <Pressable style={[styles.smallPill, styles.smallPillNo]}>
                    <Text style={[styles.smallPillText, styles.smallPillTextNo]}>No</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* pagination dots centered and inside card */}
        <View style={styles.dotsRow}>
          {SUGGESTIONS.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => goTo(i)}
              activeOpacity={0.8}
              style={styles.dotPressArea}
            >
              <View style={[styles.dot, i === index ? styles.dotActive : null]} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f6fbff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  suggHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },

  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#e8f6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(13,71,161,0.08)",
  },
  icon: { width: 24, height: 24 },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#15314a",
    fontFamily: "RubikOne",
  },

  generateBtn: {
    backgroundColor: BLUE,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  generateTxt: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },

  /* slides */
  slide: {
    backgroundColor: "transparent",
    paddingVertical: 6,
  },

  suggText: {
    color: "#263543",
    fontSize: 14,
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: "#e6edf6",
    marginTop: 12,
    marginBottom: 12,
  },

  promptRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  promptText: {
    color: "#8aa0b8",
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },

  yesNoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },

  smallPill: {
    minWidth: 44,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  smallPillYes: {
    backgroundColor: BLUE,
  },
  smallPillNo: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e6eef6",
  },
  smallPillText: {
    fontSize: 13,
    fontWeight: "700",
  },
  smallPillTextYes: {
    color: "#fff",
  },
  smallPillTextNo: {
    color: "#0D47A1",
  },

  /* dots */
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  dotPressArea: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: BLUE,
    opacity: 0.25,
  },
  dotActive: {
    opacity: 1,
  },
});
