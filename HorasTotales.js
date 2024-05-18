import React from 'react';
import { StyleSheet, Text, View, Button, ImageBackground, ScrollView } from 'react-native';

class HorasTotales extends React.Component {
    render() {
        return (
            <ImageBackground
                source={require('./Imagenes/fondo.jpg')}
                style={styles.background}
                imageStyle={{ resizeMode: 'cover' }}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Historial de Sesiones</Text>
                    <ScrollView style={styles.scrollView}>
                        {this.props.tiempos.map((duration, index) => {
                            // Convertir la duración de milisegundos a horas, minutos y segundos
                            const seconds = Math.floor((duration / 1000) % 60);
                            const minutes = Math.floor((duration / (1000 * 60)) % 60);
                            const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

                            // Formatear el tiempo en formato h:mm:ss
                            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                            return (
                                <View key={index} style={styles.sessionContainer}>
                                    <Text style={styles.session}>
                                        Sesión {index + 1}: {formattedTime}
                                    </Text>
                                    <Text style={styles.sessionText}>
                                        Alumno: {this.props.estudiantes[index].nombre}
                                    </Text>
                                    <Text style={styles.sessionText}>
                                        Código: {this.props.estudiantes[index].codigo}
                                    </Text>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>

                <View style={styles.cerrasesion}>
                    <Button title="Cerrar sesión" onPress={this.props.Deslogeado} />
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        width: '100%',
        padding: 20,
        paddingBottom: 60, // Ajuste para dejar espacio para el botón de cerrar sesión
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    scrollView: {
        width: '100%',
    },
    sessionContainer: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 5,
    },
    session: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    sessionText: {
        fontSize: 16,
        marginBottom: 5,
    },
    cerrasesion: {
        position: 'absolute',
        bottom: 20,
    },
});

export default HorasTotales;
