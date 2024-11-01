import React, { useEffect, useState, useContext } from "react";
import { View, Text, Image, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import getAuthenticatedAxios from "../../../../Utils/api";
import { AuthContext } from "../../../../Context/auth-context";

const ProfileInfo = ({ onEditClick }) => {
  const [profile, setProfile] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const api = getAuthenticatedAxios();
        const response = await api.get("/profile/profile");
        const data = response.data;

        setProfile(data.profile);
        setFollowersCount(data.followersCount);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Error al obtener el perfil. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigation]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!profile) {
    return <Text>No se encontró información del perfil</Text>;
  }

  return (
    <View style={styles.profileInfo}>
      <Image
        source={{ uri: profile.avatar_url || "/default-avatar.png" }}
        style={styles.profilePic}
      />
      <View style={styles.profileDetails}>
        <Text style={styles.profileName}>
          {profile.nombre} {profile.apellido}
        </Text>
        <Text style={styles.profileRole}>{profile.rol || "Jugador"}</Text>
        <Text style={styles.profileLocation}>
          {profile.provincia_nombre || "No especificada"}, {profile.nacion_nombre || "No especificado"}
        </Text>
        <Text style={styles.profileFollowers}>
          {followersCount} seguidores
        </Text>
      </View>
      <TouchableOpacity style={styles.editButton} onPress={onEditClick}>
        <Text style={styles.editButtonText}>Editar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profileInfo: {
    backgroundColor: "#fff",
    padding: 20,
    textAlign: "left",
    position: "relative",
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
    position: "absolute",
    top: -40,
    left: "12%",
    transform: [{ translateX: -40 }],
  },
  profileDetails: {
    marginTop: 30,
    flexGrow: 1,
    color: "#333",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  profileRole: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
  },
  profileLocation: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  profileFollowers: {
    fontSize: 14,
    color: "#157446",
  },
  editButton: {
    backgroundColor: "transparent",
    borderColor: "#157446",
    borderWidth: 2,
    borderRadius: 20,
    padding: 7,
    alignSelf: "flex-end",
    marginTop: 20,
  },
  editButtonText: {
    color: "#157446",
    fontSize: 14,
  },
});

export default ProfileInfo;
