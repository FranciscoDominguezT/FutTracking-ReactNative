import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { AuthContext } from "../../../../Context/auth-context";
import { Ionicons } from '@expo/vector-icons';


const ConfigScreen = ({ navigation }) => {
    const { logout, user } = useContext(AuthContext);
    const [isActive, setIsActive] = React.useState(true);
    const [isNotificationsMuted, setIsNotificationsMuted] = React.useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigation.navigate('Login');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <View style={styles.configContainer}>
            {/* Encabezado */}
            <View style={styles.configHeader}>
                <Ionicons name="settings-outline" size={30} color="white" />
                <Text style={styles.configTitle}>Configuración</Text>
            </View>

            {/* Información del Usuario */}
            <View style={styles.userInfoContainer}>
                <Image 
                    source={{ uri: user?.avatar_url || "https://via.placeholder.com/48" }} 
                    style={styles.userAvatar} 
                />
                <Text style={styles.userName}>{user?.nombre || 'Usuario'}{user?.apellido || 'Apellido'}</Text>
            </View>

            {/* Opciones de Configuración */}
            <View style={styles.configBody}>
                <Text style={styles.configSectionTitle}>Configuración de la cuenta</Text>
                <View style={styles.configOptions}>
                <TouchableOpacity 
                    style={styles.option}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Text>Editar perfil</Text>
                    <Ionicons name="chevron-forward" size={24} />
                </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Text>Cambiar contraseña</Text>
                        <Ionicons name="chevron-forward" size={24} />
                    </TouchableOpacity>
                    <View style={styles.optionToggle}>
                        <Text>Estado de actividad</Text>
                        <Switch
                            value={isActive}
                            onValueChange={() => setIsActive(previousState => !previousState)}
                        />
                    </View>
                    <View style={styles.optionToggle}>
                        <Text>Silenciar notificaciones</Text>
                        <Switch
                            value={isNotificationsMuted}
                            onValueChange={() => setIsNotificationsMuted(previousState => !previousState)}
                        />
                    </View>
                    <TouchableOpacity style={styles.option}>
                        <Text>Sobre nosotros</Text>
                        <Ionicons name="chevron-forward" size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Text>Políticas de privacidad</Text>
                        <Ionicons name="chevron-forward" size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Text>Términos y condiciones</Text>
                        <Ionicons name="chevron-forward" size={24} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Botón de Cerrar Sesión */}
            <View style={styles.configFooter}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={18} style={styles.powerIcon} />
                    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    configContainer: {
        flex: 1,
        backgroundColor: "#f8f8f8",
        padding: 0,
    },
    configHeader: {
        backgroundColor: "#157446",
        padding: 50,
        alignItems: "center",
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    },
    configTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginLeft: 10,
    },
    userInfoContainer: {
        backgroundColor: "#ffffff",
        width: "112%",
        margin: -35,
        borderRadius: 15,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    userAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginLeft: 30,
        marginRight: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
    configBody: {
        flex: 1,
        padding: 20,
        marginTop: 45,
    },
    configSectionTitle: {
        color: "#999",
        fontSize: 14,
        textTransform: "uppercase",
        marginBottom: 10,
        fontWeight: "500",
    },
    configOptions: {
        margin: 0,
        padding: 0,
    },
    option: {
        backgroundColor: "white",
        padding: 15,
        marginBottom: 12,
        borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    optionToggle: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        padding: 15,
        marginBottom: 12,
        borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    configFooter: {
        padding: 10,
        backgroundColor: "white",
        alignItems: "center",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginBottom: 20,
    },
    logoutButton: {
        backgroundColor: "#ff006e",
        color: "white",
        borderRadius: 50,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    logoutButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    powerIcon: {
        marginRight: 10,
    },
});

export default ConfigScreen;