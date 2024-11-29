import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  SafeAreaView,
  Platform
} from 'react-native';
import axios from 'axios';
import Footer from '../Footer';
import Header from '../Header'; 
import PlayerCard from '../PlayerCard';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

const FilterScreen = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [filters, setFilters] = useState({
    height: [140, 220],
    weight: [50, 150],
    age: [15, 45],
    nationality: '',
    position: '',
    liga: '',
    club: '',
  });
  
  const [nationalities, setNationalities] = useState([]);
  const [positions, setPositions] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    fetchPlayers();
    fetchNationalities();
    fetchPositions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, players]);

  useEffect(() => {
    if (filters.liga) {
      fetchClubs(filters.liga);
    }
  }, [filters.liga]);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('https://open-moderately-silkworm.ngrok-free.app/api/filter/players');
      setPlayers(response.data);
      setFilteredPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const fetchNationalities = async () => {
    try {
      const response = await axios.get('https://open-moderately-silkworm.ngrok-free.app/api/filter/nationalities'); // Suponiendo que tengas este endpoint
      setNationalities(response.data);
    } catch (error) {
      console.error('Error fetching nationalities:', error);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await axios.get('https://open-moderately-silkworm.ngrok-free.app/api/filter/positions'); // Suponiendo que tengas este endpoint
      setPositions(response.data);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };

  const fetchLeagues = async () => {
    try {
      const response = await axios.get('https://open-moderately-silkworm.ngrok-free.app/api/filter/leagues'); // Suponiendo que tengas este endpoint
      setLeagues(response.data);
    } catch (error) {
      console.error('Error fetching leagues:', error);
    }
  };

  const fetchClubs = async (ligaId) => {
    try {
      const response = await axios.get(`https://open-moderately-silkworm.ngrok-free.app/api/filter/clubs?ligaId=${ligaId}`); // Endpoint modificado para filtrar clubes
      setClubs(response.data);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    }
  };

  const applyFilters = () => {
    const filtered = players.filter(player =>
      player.altura >= filters.height[0] && player.altura <= filters.height[1] &&
      player.peso >= filters.weight[0] && player.peso <= filters.weight[1] &&
      player.edad >= filters.age[0] && player.edad <= filters.age[1] &&
      (filters.nationality === '' || player.nacion_nombre === filters.nationality) &&
      (filters.position === '' || player.posicion_nombre === filters.position) && // Cambia a posicion_nombre
      (filters.liga === '' || player.liga_nombre === filters.liga) &&
      (filters.club === '' || player.equipo_nombre === filters.club)
    );
    setFilteredPlayers(filtered);
  };  

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      height: [140, 220],
      weight: [50, 150],
      age: [15, 45],
      nationality: '',
      position: '',
      liga: '',
      club: '',
    });
  };

  const renderPickerItem = (label, value, options, onValueChange) => (
    <View style={styles.pickerContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.picker}
          dropdownIconColor="#FFFFFF"
        >
          <Picker.Item label={label} value="" color="#FFFFFF" />
          {options.map(option => (
            <Picker.Item 
              key={option.id} 
              label={option.nombre} 
              value={option.nombre}
              color="#FFFFFF"
            />
          ))}
        </Picker>
      </View>
    </View>
  );

  return (

    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        {/* Filters Sidebar */}
        <View style={styles.filterSidebar}>
          <ScrollView>
            <Text style={styles.title}>Filtros</Text>

            {/* Height Slider */}
            <View style={styles.sliderContainer}>
              <Text style={styles.label}>Altura</Text>
              <Slider
                style={styles.slider}
                minimumValue={140}
                maximumValue={220}
                value={filters.height[0]}
                onValueChange={(value) => handleFilterChange('height', [value, 220])}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#CCCCCC"
                thumbTintColor="#FFFFFF"
              />
              <View style={styles.sliderValues}>
                <Text style={styles.sliderText}>{Math.round(filters.height[0])}cm</Text>
                <Text style={styles.sliderText}>220cm</Text>
              </View>
            </View>

            {/* Weight Slider */}
            <View style={styles.sliderContainer}>
              <Text style={styles.label}>Peso</Text>
              <Slider
                style={styles.slider}
                minimumValue={50}
                maximumValue={150}
                value={filters.weight[0]}
                onValueChange={(value) => handleFilterChange('weight', [value, 150])}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#CCCCCC"
                thumbTintColor="#FFFFFF"
              />
              <View style={styles.sliderValues}>
                <Text style={styles.sliderText}>{Math.round(filters.weight[0])}kg</Text>
                <Text style={styles.sliderText}>150kg</Text>
              </View>
            </View>

            {/* Age Slider */}
            <View style={styles.sliderContainer}>
              <Text style={styles.label}>Edad</Text>
              <Slider
                style={styles.slider}
                minimumValue={15}
                maximumValue={45}
                value={filters.age[0]}
                onValueChange={(value) => handleFilterChange('age', [value, 45])}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#CCCCCC"
                thumbTintColor="#FFFFFF"
              />
              <View style={styles.sliderValues}>
                <Text style={styles.sliderText}>{Math.round(filters.age[0])} años</Text>
                <Text style={styles.sliderText}>45 años</Text>
              </View>
            </View>

            {/* Pickers */}
            {renderPickerItem('Nacionalidad', filters.nationality, nationalities, 
              (value) => {
                handleFilterChange('nationality', value);
                fetchLeagues();
              }
            )}
            {renderPickerItem('Posición', filters.position, positions, 
              (value) => handleFilterChange('position', value)
            )}
            {renderPickerItem('Liga', filters.liga, leagues, 
              (value) => handleFilterChange('liga', value)
            )}
            {renderPickerItem('Club', filters.club, clubs, 
              (value) => handleFilterChange('club', value)
            )}

            {/* Filter Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.resetButton]} 
                onPress={resetFilters}
              >
                <Text style={styles.buttonText}>Borrar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.applyButton]} 
                onPress={applyFilters}
              >
                <Text style={styles.buttonText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Players Grid */}
        <ScrollView style={styles.playersContainer}>
          <View style={styles.playersGrid}>
              {filteredPlayers.map(player => (
                  <PlayerCard key={player.id} player={player} />
              ))}
          </View>
      </ScrollView>
      </View>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  filterSidebar: {
    width: width * 0.45,
    backgroundColor: '#f4f4f4',
    padding: 15,
    borderRightWidth: 1,
    borderColor: '#EEEEEE',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6c3e3e',
  },
  sliderContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6c3e3e',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  sliderText: {
    fontSize: 12,
    color: '#555555',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerWrapper: {
    backgroundColor: '#7e7e7e',
    borderRadius: 25,
    overflow: 'hidden',
  },
  picker: {
    height: 45,
    color: '#FFFFFF',
    ...Platform.select({
      android: {
        backgroundColor: 'transparent',
      }
    })
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  resetButton: {
    backgroundColor: '#DDDDDD',
  },
  applyButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  playersContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  playersGrid: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default FilterScreen;