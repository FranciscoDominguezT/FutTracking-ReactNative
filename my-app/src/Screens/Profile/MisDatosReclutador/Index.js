import React, { useEffect, useState, useContext } from "react";
import { View, Text, TextInput, Button, Alert, Picker, ActivityIndicator, TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../../../Context/auth-context"; // Ajusta la ruta según tu estructura

const MisDatosReclutador = () => {
    const [userData, setUserData] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({
        nacion_id: '',
        provincia_id: '',
        email: ''
    });
    const [naciones, setNaciones] = useState([]);
    const [provincias, setProvincias] = useState([]);

    useEffect(() => {
        fetchUserData();
        fetchNaciones();
    }, []);

    useEffect(() => {
        if (editData.nacion_id) {
            fetchProvincias(editData.nacion_id);
        }
    }, [editData.nacion_id]);

    const fetchUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get('http://localhost:5001/api/user/userdata', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserData(response.data);
            setEditData({
                nacion_id: response.data.nacion_id || '',
                provincia_id: response.data.provincia_id || '',
                email: response.data.email || ''
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchNaciones = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/user/naciones');
            setNaciones(response.data);
        } catch (error) {
            console.error('Error fetching naciones:', error);
        }
    };

    const fetchProvincias = async (nacionId) => {
        try {
            const response = await axios.get(`http://localhost:5001/api/user/provincias/${nacionId}`);
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
            const token = await AsyncStorage.getItem('token');
            await axios.put('http://localhost:5001/api/user/userdata', editData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            Alert.alert('Éxito', 'Datos actualizados correctamente');
            setEditing(false);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    if (!userData) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Mis Datos</Text>
            <TouchableOpacity onPress={handleEdit}>
                <Text style={{ color: 'blue', marginVertical: 10 }}>Editar</Text>
            </TouchableOpacity>
            
            {!editing ? (
                <View>
                    <Text><Text style={{ fontWeight: 'bold' }}>Nacionalidad:</Text> {naciones.find(n => n.id === userData.nacion_id)?.nombre || 'No especificada'}</Text>
                    <Text><Text style={{ fontWeight: 'bold' }}>Correo electrónico:</Text> {userData.email}</Text>
                    <Text><Text style={{ fontWeight: 'bold' }}>Residencia:</Text> {provincias.find(p => p.id === userData.provincia_id)?.nombre || 'No especificada'}</Text>
                </View>
            ) : (
                <View>
                    <Text>Nacionalidad:</Text>
                    <Picker
                        selectedValue={editData.nacion_id}
                        onValueChange={(value) => handleChange('nacion_id', value)}
                    >
                        <Picker.Item label="No especificada" value="" />
                        {naciones.map(nacion => (
                            <Picker.Item key={nacion.id} label={nacion.nombre} value={nacion.id} />
                        ))}
                    </Picker>

                    <Text>Correo electrónico:</Text>
                    <TextInput
                        style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
                        value={editData.email}
                        onChangeText={(value) => handleChange('email', value)}
                        keyboardType="email-address"
                    />

                    <Text>Residencia:</Text>
                    <Picker
                        selectedValue={editData.provincia_id}
                        onValueChange={(value) => handleChange('provincia_id', value)}
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

export default MisDatosReclutador;
