import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Contador from './Contador';
import HorasTotales from './HorasTotales';
import Anuncios from './Anuncios';
import Icono from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundTimer from 'react-native-background-timer';

const Tab = createBottomTabNavigator();

class VentanaLogin extends React.Component {
    state = {
        isLoggedIn: false,
        comienzoTiempo: null,
        conteoTiempo: 0,
        tiempos: [],
        usuario: null,
        tiempoSesion: '00:00:00',
        estudiantes: []
    };

    Logeado = async (usuario) => {
        const comienzoTiempo = Date.now();
        this.setState({
            isLoggedIn: true,
            comienzoTiempo: comienzoTiempo,
            usuario: usuario
        });

        // Detener el temporizador existente si está activo
        BackgroundTimer.stopBackgroundTimer();

        // Guardar el inicio del tiempo en AsyncStorage
        try {
            await AsyncStorage.setItem('comienzoTiempo', comienzoTiempo.toString());
        } catch (error) {
            console.log(error);
        }

        // Iniciar un nuevo temporizador
        BackgroundTimer.runBackgroundTimer(() => {
            this.setState(prevState => ({
                conteoTiempo: Date.now() - comienzoTiempo
            }));
        }, 1000);
    }

    Deslogeado = async () => {
        BackgroundTimer.stopBackgroundTimer();

        const tiempoSesion = Date.now() - this.state.comienzoTiempo;

        this.setState(prevState => ({
            isLoggedIn: false,
            conteoTiempo: 0,
            comienzoTiempo: null,
            tiempos: [...prevState.tiempos, tiempoSesion],
            estudiantes: [...prevState.estudiantes, this.state.usuario]
        }), async () => {
            // Guardar todos los tiempos de sesión en AsyncStorage
            try {
                await AsyncStorage.setItem('tiempos', JSON.stringify(this.state.tiempos));
                await AsyncStorage.setItem('estudiantes', JSON.stringify(this.state.estudiantes));
                console.log('Datos guardados en AsyncStorage en deslogeo');
                console.log(JSON.stringify(this.state.tiempos));
            } catch (error) {
                console.log(error);
            }
        });
    }

    // Método para cargar los datos de AsyncStorage cuando la aplicación se inicia
    cargarDatos = async () => {
        try {
            const comienzoTiempo = await AsyncStorage.getItem('comienzoTiempo');
            const tiempos = await AsyncStorage.getItem('tiempos');
            const estudiantes = await AsyncStorage.getItem('estudiantes');

            if (comienzoTiempo !== null) {
                this.setState({
                    comienzoTiempo: parseInt(comienzoTiempo),
                    conteoTiempo: Date.now() - parseInt(comienzoTiempo)
                }, () => {
                    BackgroundTimer.runBackgroundTimer(() => {
                        this.setState(prevState => ({
                            conteoTiempo: Date.now() - this.state.comienzoTiempo
                        }));
                    }, 1000);
                });
            }
            if (tiempos !== null) {
                this.setState({ tiempos: JSON.parse(tiempos) });
            }
            if (estudiantes !== null) {
                this.setState({ estudiantes: JSON.parse(estudiantes) });
            }
            console.log('Datos cargados de AsyncStorage en cargarDatos');
            console.log(tiempos);
        } catch (error) {
            console.log(error);
        }
    }

    limpiarDatos = async () => {
        try {
            // Eliminar los datos almacenados en AsyncStorage
            await AsyncStorage.removeItem('comienzoTiempo');
            await AsyncStorage.removeItem('tiempos');
            await AsyncStorage.removeItem('estudiantes');

            // Limpiar el estado de la aplicación
            this.setState({
                comienzoTiempo: null,
                conteoTiempo: 0,
                tiempos: [],
                usuario: null,
                estudiantes: []
            });

            console.log('Datos eliminados de AsyncStorage correctamente.');
        } catch (error) {
            console.log('Error al eliminar los datos de AsyncStorage:', error);
        }
    }
    componentDidMount() {
        // Cargar los datos al iniciar la aplicación, pero cuando se reinicia el servidor 
        //this.limpiarDatos();
        this.cargarDatos();
    }

    render() {
        return (
            <NavigationContainer>
                {this.state.isLoggedIn ? (
                    <Tab.Navigator>
                        <Tab.Screen
                            name="Contador"
                            options={{
                                tabBarIcon: ({ focused, color, size }) => (
                                    <Icono
                                        name={focused ? 'counter' : 'counter'}
                                        size={size}
                                        color={color}
                                    />
                                ),
                            }}
                        >
                            {() => <Contador conteoTiempo={this.state.conteoTiempo} Deslogeado={this.Deslogeado} usuario={this.state.usuario} />}
                        </Tab.Screen>

                        <Tab.Screen
                            name="HorasTotales"
                            options={{
                                tabBarIcon: ({ focused, color, size }) => (
                                    <Icono
                                        name={focused ? 'clock' : 'clock-outline'}
                                        size={size}
                                        color={color}
                                    />
                                ),
                            }}
                        >
                            {() => <HorasTotales tiempos={this.state.tiempos} Deslogeado={this.Deslogeado} estudiantes={this.state.estudiantes} />}
                        </Tab.Screen>
                        <Tab.Screen
                            name="Anuncios"
                            options={{
                                tabBarIcon: ({ focused, color, size }) => (
                                    <Icono
                                        name={focused ? 'bell' : 'bell-outline'}
                                        size={size}
                                        color={color}
                                    />
                                ),
                            }}
                        >
                            {() => <Anuncios Deslogeado={this.Deslogeado} />}
                        </Tab.Screen>
                    </Tab.Navigator>
                ) : (
                    <Login Logeado={this.Logeado} />
                )}
            </NavigationContainer>
        );
    }
}

class Login extends React.Component {
    state = { //el state es donde estan las variables que se van a estar actualizando
        codigo: '222309013',
        nip: 'error400',
        usuario: null,
        partes: []
    };

    comprobacionLogin = async () => {
        axios.post('http://148.202.152.33/cucei/autentificacion_siauu_temporal.php',
            {
                codigo: this.state.codigo, //codigo es es la variable que se va a enviar al servidor
                nip: this.state.nip
            },
            {
                headers: //esto es para que el servidor sepa que tipo de datos se le estan enviando
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).then(response => {

            switch (response.data) {
                case 0:
                    Alert.alert('Error', 'Credenciales incorrectas', [
                        { text: 'Ok', onPress: () => console.log('OK Pressed') },
                    ]);
                    break;

                default:
                    //console.log(response.data); //ahora voy a almacenar todos los datos que me regreso el servidor
                    partes = response.data.split(','); //partes es un arreglo que va a tener los datos separados por comas
                    // Crea un objeto para almacenar los datos
                    usuario = {
                        codigo: partes[1],
                        nombre: partes[2]
                    };
                    // Actualiza el estado con los datos del usuario
                    this.setState({
                        usuario: usuario
                    });
                    // Ahora puedes usar el objeto 'usuario' como desees
                    console.log(usuario.codigo);
                    console.log(usuario.nombre);
                    this.props.Logeado(usuario);
                    break;
            }
        })
    };

    render() {
        return (
            <ImageBackground
                source={require('./Imagenes/fondo.jpg')}
                style={styles.background}
                imageStyle={{ resizeMode: 'cover' }}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Iniciar Sesión</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Código"
                        onChangeText={codigo => this.setState({ codigo })}
                        value={this.state.codigo}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="NIP"
                        onChangeText={nip => this.setState({ nip })}
                        value={this.state.nip}
                        secureTextEntry={true}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.comprobacionLogin}
                    >
                        <Text style={styles.buttonText}>Entrar</Text>

                    </TouchableOpacity>
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
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        width: '100%',
        height: 40,
        backgroundColor: '#007bff',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default VentanaLogin;