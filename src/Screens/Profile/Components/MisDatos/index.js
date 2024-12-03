import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { AuthContext } from "../../../../Context/auth-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const MisDatos = () => {
  const { token, fetchUserData, user } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    edad: "",
    altura: "",
    nacion_id: "",
    provincia_id: "",
    email: "",
    nacion_nombre: "", // Nuevo campo para el nombre de la nacionalidad
    provincia_nombre: "",
  });
  const [naciones, setNaciones] = useState([]);
  const [provincias, setProvincias] = useState([]);

  useEffect(() => {
    if (token) {
      fetchUserData(token);
      fetchNaciones();
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      setEditData({
        edad: user.edad ? user.edad.toString() : "",
        altura: user.altura ? user.altura.toString() : "",
        nacion_id: user.nacion_id ? user.nacion_id.toString() : "",
        provincia_id: user.provincia_id ? user.provincia_id.toString() : "",
        email: user.email || "",
        nacion_nombre: user.nacion_nombre || "No especificada", // Nombre de la nacionalidad
        provincia_nombre: user.provincia_nombre || "No especificada", // Nombre de la provincia
      });

      if (user.nacion_id) {
        fetchProvincias(user.nacion_id);
      }
    }
  }, [user]);

  const fetchNaciones = async () => {
    try {
      const response = await axios.get(
        "https://open-moderately-silkworm.ngrok-free.app/api/user/naciones"
      );
      setNaciones(response.data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las nacionalidades");
    }
  };

  const fetchProvincias = async (nacionId) => {
    try {
      const response = await axios.get(
        `https://open-moderately-silkworm.ngrok-free.app/api/user/provincias/${nacionId}`
      );
      setProvincias(response.data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las provincias");
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (name, value) => {
    setEditData((prev) => ({ ...prev, [name]: value }));
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
        "https://open-moderately-silkworm.ngrok-free.app/api/user/userdata",
        dataToSend,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Éxito", "Datos actualizados correctamente");
      setEditing(false);
      fetchUserData(token);
    } catch (error) {
      Alert.alert("Error", "Hubo un error al actualizar tus datos.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Mis Datos</Text>
        <TouchableOpacity onPress={handleEdit}>
          <Ionicons name="pencil" size={20} color="#007bff" style={styles.editIcon} />
        </TouchableOpacity>
      </View>

      {!editing ? (
        <View>
          <Text style={styles.label}>Nacionalidad:</Text>
          <Text style={styles.value}>{editData.nacion_nombre}</Text>

          <Text style={styles.label}>Correo electrónico:</Text>
          <Text style={styles.value}>{editData.email}</Text>

          <Text style={styles.label}>Residencia:</Text>
          <Text style={styles.value}>{editData.provincia_nombre}</Text>

          <Text style={styles.label}>Edad:</Text>
          <Text style={styles.value}>{editData.edad || "No especificada"}</Text>

          <Text style={styles.label}>Altura (cm):</Text>
          <Text style={styles.value}>{editData.altura || "No especificada"}</Text>
        </View>
      ) : (
        <View>
          <Text style={styles.label}>Nacionalidad:</Text>
          <Picker
            selectedValue={editData.nacion_id}
            onValueChange={(value) => handleChange("nacion_id", value)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccionar..." value="" />
            {naciones.map((nacion) => (
              <Picker.Item key={nacion.id} label={nacion.nombre} value={nacion.id.toString()} />
            ))}
          </Picker>

          <Text style={styles.label}>Correo electrónico:</Text>
          <TextInput
            style={styles.input}
            value={editData.email}
            onChangeText={(value) => handleChange("email", value)}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Residencia:</Text>
          <Picker
            selectedValue={editData.provincia_id}
            onValueChange={(value) => handleChange("provincia_id", value)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccionar..." value="" />
            {provincias.map((provincia) => (
              <Picker.Item
                key={provincia.id}
                label={provincia.nombre}
                value={provincia.id.toString()}
              />
            ))}
          </Picker>

          <Text style={styles.label}>Edad:</Text>
          <TextInput
            style={styles.input}
            value={editData.edad}
            onChangeText={(value) => handleChange("edad", value)}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Altura (cm):</Text>
          <TextInput
            style={styles.input}
            value={editData.altura}
            onChangeText={(value) => handleChange("altura", value)}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Guardar cambios</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  label: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 5,
    paddingVertical: 5,
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#157446",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MisDatos;
