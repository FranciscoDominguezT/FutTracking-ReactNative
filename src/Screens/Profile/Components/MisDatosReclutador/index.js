import React, { useEffect, useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Picker, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { AuthContext } from "../../../../Context/auth-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const MisDatosReclutador = () => {
  const { token, isLoading, fetchUserData, user } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    nacion_id: '',
    provincia_id: '',
    email: '',
  });
  const [naciones, setNaciones] = useState([]);
  const [provincias, setProvincias] = useState([]);

  useEffect(() => {
    if (token) {
      fetchUserData(token);
    }
  }, [token, fetchUserData]);

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
    }
  };

  const fetchProvincias = async (nacionId) => {
    try {
      const response = await axios.get(`https://open-moderately-silkworm.ngrok-free.app/api/user/provincias/${nacionId}`);
      setProvincias(response.data);
    } catch (error) {
      console.error('Error fetching provincias:', error);
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
      await axios.put('https://open-moderately-silkworm.ngrok-free.app/api/user/userdata', editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Datos actualizados correctamente');
      setEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
      Alert.alert('Error', 'Hubo un error al actualizar tus datos.');
    }
  };

  if (isLoading) {
    return <Text>Cargando...</Text>;
  }

  if (!user) {
    return <Text>No se encontró información del usuario.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Mis Datos
        <Ionicons name="pencil" size={20} color="#007bff" onPress={handleEdit} style={styles.editIcon} />
      </Text>

      {!editing ? (
        <View style={styles.datosList}>
          <Text style={styles.item}>
            <Text style={styles.bold}>Nacionalidad:</Text> {naciones.find(n => n.id === user.nacion_id)?.nombre || 'No especificada'}
          </Text>
          <Text style={styles.item}>
            <Text style={styles.bold}>Correo electrónico:</Text> {user.email}
          </Text>
          <Text style={styles.item}>
            <Text style={styles.bold}>Residencia:</Text> {provincias.find(p => p.id === user.provincia_id)?.nombre || 'No especificada'}
          </Text>
        </View>
      ) : (
        <View style={styles.editForm}>
          <Text style={styles.label}>Nacionalidad:</Text>
          <Picker
            selectedValue={editData.nacion_id}
            onValueChange={(itemValue) => handleChange('nacion_id', itemValue)}
            style={styles.input}
          >
            <Picker.Item label="No especificada" value="" />
            {naciones.map(nacion => (
              <Picker.Item key={nacion.id} label={nacion.nombre} value={nacion.id} />
            ))}
          </Picker>

          <Text style={styles.label}>Correo electrónico:</Text>
          <TextInput
            style={styles.input}
            value={editData.email}
            onChangeText={(value) => handleChange('email', value)}
          />

          <Text style={styles.label}>Residencia:</Text>
          <Picker
            selectedValue={editData.provincia_id}
            onValueChange={(itemValue) => handleChange('provincia_id', itemValue)}
            style={styles.input}
          >
            <Picker.Item label="No especificada" value="" />
            {provincias.map(provincia => (
              <Picker.Item key={provincia.id} label={provincia.nombre} value={provincia.id} />
            ))}
          </Picker>

          <Button title="Guardar" onPress={handleSubmit} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editIcon: {
    marginLeft: 8,
    cursor: 'pointer',
  },
  datosList: {
    fontSize: 16,
    color: '#555',
  },
  item: {
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  editForm: {
    marginTop: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
});

export default MisDatosReclutador;