import React, { useEffect, useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import axios from "axios";
import { AuthContext } from "../../../../Context/auth-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const MisDatos = () => {
  const { token, isLoading, fetchUserData, user } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    edad: '',
    altura: '',
    nacion_id: '',
    provincia_id: '',
    email: '',
  });
  const [naciones, setNaciones] = useState([]);
  const [provincias, setProvincias] = useState([]);

  useEffect(() => {
    if (token) {
      fetchUserData(token);
      fetchNaciones();
    }
  }, [token, fetchUserData]);

  useEffect(() => {
    if (user) {
      setEditData({
        edad: user.edad ? user.edad.toString() : '',
        altura: user.altura ? user.altura.toString() : '',
        nacion_id: user.nacion_id ? user.nacion_id.toString() : '',
        provincia_id: user.provincia_id ? user.provincia_id.toString() : '',
        email: user.email || '',
      });
      
      if (user.nacion_id) {
        fetchProvincias(user.nacion_id);
      }
    }
  }, [user]);

  useEffect(() => {
    if (editData.nacion_id) {
      fetchProvincias(editData.nacion_id);
    }
  }, [editData.nacion_id]);

  const fetchNaciones = async () => {
    try {
      const response = await axios.get('https://open-moderately-silkworm.ngrok-free.app/api/user/naciones');
      setNaciones(response.data);
    } catch (error) {
      console.error('Error fetching naciones:', error);
      Alert.alert('Error', 'No se pudieron cargar las nacionalidades');
    }
  };

  const fetchProvincias = async (nacionId) => {
    try {
      const response = await axios.get(`https://open-moderately-silkworm.ngrok-free.app/api/user/provincias/${nacionId}`);
      setProvincias(response.data);
    } catch (error) {
      console.error('Error fetching provincias:', error);
      Alert.alert('Error', 'No se pudieron cargar las provincias');
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (name, value) => {
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        ...editData,
        edad: parseInt(editData.edad),
        altura: parseInt(editData.altura),
        nacion_id: parseInt(editData.nacion_id),
        provincia_id: parseInt(editData.provincia_id),
      };

      await axios.put(
        'https://open-moderately-silkworm.ngrok-free.app/api/user/userdata', 
        dataToSend, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      Alert.alert('Éxito', 'Datos actualizados correctamente');
      setEditing(false);
      fetchUserData(token); // Actualizar los datos mostrados
    } catch (error) {
      console.error('Error updating user data:', error);
      Alert.alert('Error', 'Hubo un error al actualizar tus datos.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text>No se encontró información del usuario.</Text>
      </View>
    );
  }

  const getCurrentNacionName = () => {
    const nacion = naciones.find(n => n.id === parseInt(user.nacion_id));
    return nacion ? nacion.nombre : 'No especificada';
  };

  const getCurrentProvinciaName = () => {
    const provincia = provincias.find(p => p.id === parseInt(user.provincia_id));
    return provincia ? provincia.nombre : 'No especificada';
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Mis Datos</Text>
        <TouchableOpacity onPress={handleEdit}>
          <Ionicons name="pencil" size={20} color="#007bff" style={styles.editIcon} />
        </TouchableOpacity>
      </View>

      {!editing ? (
        <View style={styles.datosList}>
          <View style={styles.dataRow}>
            <Text style={styles.bold}>Nacionalidad:</Text>
            <Text style={styles.value}>{getCurrentNacionName()}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.bold}>Correo electrónico:</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.bold}>Residencia:</Text>
            <Text style={styles.value}>{getCurrentProvinciaName()}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.bold}>Edad:</Text>
            <Text style={styles.value}>{user.edad || 'No especificada'}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.bold}>Altura:</Text>
            <Text style={styles.value}>{user.altura ? `${user.altura} cm` : 'No especificada'}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.editForm}>
          <Text style={styles.label}>Nacionalidad:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={editData.nacion_id}
              onValueChange={(itemValue) => handleChange('nacion_id', itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Seleccionar..." value="" />
              {naciones.map(nacion => (
                <Picker.Item key={nacion.id.toString()} label={nacion.nombre} value={nacion.id.toString()} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Correo electrónico:</Text>
          <TextInput
            style={styles.input}
            value={editData.email}
            onChangeText={(value) => handleChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Residencia:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={editData.provincia_id}
              onValueChange={(itemValue) => handleChange('provincia_id', itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Seleccionar..." value="" />
              {provincias.map(provincia => (
                <Picker.Item key={provincia.id.toString()} label={provincia.nombre} value={provincia.id.toString()} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Edad:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={editData.edad}
            onChangeText={(value) => handleChange('edad', value)}
          />

          <Text style={styles.label}>Altura (cm):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={editData.altura}
            onChangeText={(value) => handleChange('altura', value)}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Guardar cambios</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
  },
  headerContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  editIcon: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datosList: {
    paddingHorizontal: 10,
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  value: {
    flex: 2,
    color: '#666',
  },
  editForm: {
    paddingHorizontal: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MisDatos;