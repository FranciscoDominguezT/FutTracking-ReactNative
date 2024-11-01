import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Tabs = ({ activeTab, onTabChange }) => {
  const tabRefs = useRef([]);

  useEffect(() => {
    const activeTabIndex = tabRefs.current.findIndex(tab => tab.props.children === activeTab);
    if (activeTabIndex !== -1) {
      const tabWidth = 100 / tabRefs.current.length; // Assuming equal width for each tab
      setTabPosition((activeTabIndex) * tabWidth);
    }
  }, [activeTab]);

  const handleTabClick = (tab) => {
    onTabChange(tab);
  };

  return (
    <View style={styles.tabs}>
      <View style={[styles.tabIndicator, { left: `${tabPosition}%` }]} />
      {['Videos', 'Posteos', 'MisDatos'].map((tab, index) => (
        <TouchableOpacity
          key={tab}
          ref={el => tabRefs.current[index] = el}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => handleTabClick(tab)}
        >
          <Text style={styles.tabText}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabs: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flexGrow: 1,
    textAlign: 'center',
    paddingVertical: 10,
    cursor: 'pointer',
    color: '#555',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    borderWidth: 0,
    position: 'relative',
    zIndex: 1,
    transition: 'color 0.3s ease',
  },
  activeTab: {
    color: '#157446',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '33.33%', // Assuming three tabs
    height: 3,
    backgroundColor: '#157446',
    transition: 'transform 0.3s ease',
    zIndex: 0,
  },
  tabText: {
    color: '#555',
  },
});

export default Tabs;
