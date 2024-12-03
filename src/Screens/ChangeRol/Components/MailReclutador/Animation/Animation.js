import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const BackgroundAnimation = () => {
  const elements = useRef([...Array(5)].map(() => ({
    position: new Animated.ValueXY({
      x: Math.random() * Dimensions.get('window').width,
      y: Math.random() * Dimensions.get('window').height,
    }),
    opacity: new Animated.Value(0.2),
  }))).current;

  useEffect(() => {
    const startAnimation = () => {
      elements.forEach(element => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(element.position.y, {
              toValue: Dimensions.get('window').height + 100,
              duration: Math.random() * 15000 + 10000,
              useNativeDriver: true,
            }),
            Animated.timing(element.position.y, {
              toValue: -100,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    };

    startAnimation();
  }, []);

  return (
    <View style={StyleSheet.absoluteFill}>
      {elements.map((element, index) => (
        <Animated.View
          key={index}
          style={[
            styles.element,
            {
              transform: [
                { translateX: element.position.x },
                { translateY: element.position.y },
              ],
              opacity: element.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  element: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0a743b',
  },
});

export default BackgroundAnimation;