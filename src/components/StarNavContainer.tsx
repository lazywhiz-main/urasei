import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StarNavButton } from './StarNavButton';
import { CircularStarMenu } from './CircularStarMenu';

interface StarNavContainerProps {
  currentStar: 'sanctuary' | 'divination' | 'waruiko' | 'record' | 'settings';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  size?: number;
}

export const StarNavContainer: React.FC<StarNavContainerProps> = ({
  currentStar,
  position = 'top-right',
  size = 50,
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleStarPress = () => {
    setIsMenuVisible(true);
  };

  const handleMenuClose = () => {
    setIsMenuVisible(false);
  };

  const getPositionStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      zIndex: 9999,
    };

    switch (position) {
      case 'top-right':
        return { ...baseStyle, top: 60, right: 20 };
      case 'top-left':
        return { ...baseStyle, top: 60, left: 20 };
      case 'bottom-right':
        return { ...baseStyle, bottom: 60, right: 20 };
      case 'bottom-left':
        return { ...baseStyle, bottom: 60, left: 20 };
      default:
        return { ...baseStyle, top: 60, right: 20 };
    }
  };

  return (
    <>
      <View style={[styles.container, getPositionStyle()]}>
        <StarNavButton
          starType={currentStar}
          onPress={handleStarPress}
          size={size}
        />
      </View>
      
      <CircularStarMenu
        visible={isMenuVisible}
        currentStar={currentStar}
        onClose={handleMenuClose}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 