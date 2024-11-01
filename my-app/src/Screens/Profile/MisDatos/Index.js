import React, { useEffect, useState } from "react";
import axios from "axios";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker'; // Asegúrate de tener esta librería instalada
import { FaPencilAlt } from "react-icons/fa"; // Si usas react-native-vector-icons o similar, necesitarás ajustar los íconos.

const MisDatos = () => {
    const [userData, setUserData] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({
        edad: '',
        altura: '',
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
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5001/api/user/userdata', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserData(response.data);
            setEditData({
                edad: response.data.edad || '',
                altura: response.data.altura || '',
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
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5001/api/user/userdata', editData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            Alert.alert('Datos actualizados correctamente');
            setEditing(false); // Para salir del modo de edición después de guardar
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    if (!userData) {
        return <Text>Cargando...</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Mis Datos
                <TouchableOpacity onPress={handleEdit}>
                    <FaPencilAlt style={styles.editIcon} />
                </TouchableOpacity>
            </Text>
            <ScrollView style={styles.scrollView}>
                {!editing ? (
                    <View style={styles.dataList}>
                        <Text style={styles.dataItem}><strong>Nacionalidad:</strong> {naciones.find(n => n.id === userData.nacion_id)?.nombre}</Text>
                        <Text style={styles.dataItem}><strong>Correo electrónico:</strong> {userData.email}</Text>
                        <Text style={styles.dataItem}><strong>Residencia:</strong> {provincias.find(p => p.id === userData.provincia_id)?.nombre}</Text>
                        <Text style={styles.dataItem}><strong>Edad:</strong> {userData.edad}</Text>
                        <Text style={styles.dataItem}><strong>Altura:</strong> {userData.altura} cm</Text>
                    </View>
                ) : (
                    <View style={styles.editForm}>
                        <View>
                            <Text style={styles.label}>Nacionalidad:</Text>
                            <Picker
                                selectedValue={editData.nacion_id}
                                onValueChange={(itemValue) => handleChange('nacion_id', itemValue)}
                                style={styles.input}
                            >
                                <Picker.Item label="Seleccionar..." value="" />
                                {naciones.map(nacion => (
                                    <Picker.Item key={nacion.id} label={nacion.nombre} value={nacion.id} />
                                ))}
                            </Picker>
                        </View>
                        <View>
                            <Text style={styles.label}>Correo electrónico:</Text>
                            <TextInput
                                style={styles.input}
                                value={editData.email}
                                onChangeText={(value) => handleChange('email', value)}
                                keyboardType="email-address"
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>Residencia:</Text>
                            <Picker
                                selectedValue={editData.provincia_id}
                                onValueChange={(itemValue) => handleChange('provincia_id', itemValue)}
                                style={styles.input}
                            >
                                <Picker.Item label="Seleccionar..." value="" />
                                {provincias.map(provincia => (
                                    <Picker.Item key={provincia.id} label={provincia.nombre} value={provincia.id} />
                                ))}
                            </Picker>
                        </View>
                        <View>
                            <Text style={styles.label}>Edad:</Text>
                            <TextInput
                                style={styles.input}
                                value={editData.edad}
                                onChangeText={(value) => handleChange('edad', value)}
                                keyboardType="numeric"
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>Altura (cm):</Text>
                            <TextInput
                                style={styles.input}
                                value={editData.altura}
                                onChangeText={(value) => handleChange('altura', value)}
                                keyboardType="numeric"
                            />
                        </View>
                        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                            <Text style={styles.buttonText}>Guardar cambios</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#fff',
        minHeight: 480,
        maxWidth: 600,
        margin: 20,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // Solo para Android
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 15,
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    editIcon: {
        marginLeft: 8,
        fontSize: 18,
        cursor: 'pointer',
        color: '#007bff',
    },
    dataList: {
        fontSize: 16,
        color: '#555',
    },
    dataItem: {
        margin: 0,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    editForm: {
        marginBottom: 10,
    },
    label: {
        display: 'block',
        marginBottom: 4,
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        width: '100%',
        padding: 6,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 4,
        fontSize: 14,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: 10,
        borderRadius: 4,
        cursor: 'pointer',
        fontSize: 16,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    scrollView: {
        maxHeight: '80%', // Limitar la altura del ScrollView
    },
});

export default MisDatos;
