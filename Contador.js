import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Button } from 'react-native';


class Contador extends React.Component {

    state = {
        tiempoSesion: '00:00:00', // Tiempo de sesión (simulado)

    };

    render() {
        // Convertir el tiempo transcurrido en formato hh:mm:ss
        const formatoTiempo = () => {
            const seconds = Math.floor((this.props.conteoTiempo / 1000) % 60);
            const minutes = Math.floor((this.props.conteoTiempo / (1000 * 60)) % 60);
            const hours = Math.floor((this.props.conteoTiempo / (1000 * 60 * 60)) % 24);

            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        return (
            <ImageBackground
                source={require('./Imagenes/fondo.jpg')}
                style={styles.background}
                imageStyle={{ resizeMode: 'cover' }}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Contador de Tiempo</Text>
                    <Text style={styles.info}>Código: {this.props.usuario.codigo}</Text>
                    <Text style={styles.info}>Nombre: {this.props.usuario.nombre}</Text>
                    <Text style={styles.timer}>{formatoTiempo()}</Text>
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
        width: '80%',
        maxWidth: 400,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    info: {
        fontSize: 16,
        marginBottom: 5,

    },
    timer: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    cerrasesion: {
        position: 'absolute',
        bottom: 20,
    },
});

export default Contador;
