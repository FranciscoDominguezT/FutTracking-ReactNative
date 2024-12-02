import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Tabs = ({ activeTab, onTabChange }) => {
  const [tabPosition, setTabPosition] = React.useState(0);
  const tabRefs = useRef([]);

  useEffect(() => {
    const activeTabIndex = ['Videos', 'Posteos', 'MisDatos'].findIndex((tab) => tab === activeTab);
    if (activeTabIndex !== -1) {
      const activeTabElement = tabRefs.current[activeTabIndex];
      if (activeTabElement) {
        activeTabElement.measure((x, y, width, height, pageX, pageY) => {
          setTabPosition(pageX); // Usar posición absoluta
        });
      }
    }
  }, [activeTab]);

  const handleTabClick = (tab) => {
    if (onTabChange) onTabChange(tab);
  };

  return (
    <View style={styles.tabs}>
      <View style={[styles.tabIndicator, { transform: [{ translateX: tabPosition }] }]} />
      {['Videos', 'Posteos', 'Mas Info', 'Contactar'].map((tab, index) => (
        <TouchableOpacity
          key={tab}
          ref={(el) => (tabRefs.current[index] = el)}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => handleTabClick(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    position: 'relative',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#157446',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  activeTabText: {
    color: '#157446',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
    backgroundColor: '#157446',
    width: '25%',
    transition: 'transform 0.3s ease',
  },
});

export default Tabs;
