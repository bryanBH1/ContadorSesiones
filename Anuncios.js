import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ImageBackground, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Anuncios = ({ Deslogeado }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const subscriber = firestore().collection('Anuncios').orderBy('FechaCreacion', 'desc').onSnapshot(querySnapshot => {
            const anunciosData = querySnapshot.docs.map(doc => {
                return { id: doc.id, ...doc.data() };
            });
            setData(anunciosData);
        });

        //retorna 
        return () => subscriber();
    }, []);

    return (
        <ImageBackground
            source={require('./Imagenes/fondo.jpg')} // Ajusta la ruta de la imagen de fondo según tu estructura de archivos
            style={styles.background}
            imageStyle={{ resizeMode: 'cover' }}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Anuncios</Text>
                <ScrollView style={styles.scrollView}>
                    {data.map((item, index) => (
                        <View key={index} style={styles.anuncio}>
                            <Icon name="newspaper" size={24} color="#333" style={styles.icono} />
                            <View>
                                <Text style={styles.infoTitulo}>{item.Titulo}</Text>
                                <Text style={styles.info}>{item.Mensaje}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <View style={styles.cerrasesion}>
                <Button title="Cerrar sesión" onPress={Deslogeado} />
            </View>
        </ImageBackground>
    );
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
        padding: 30,
        paddingHorizontal: 15, // Reduce el padding horizontal para pegar más los anuncios a los laterales
        paddingBottom: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white', // Ajusta el color del texto según tu diseño
        textAlign: 'center', // Centra el título horizontalmente
    },
    scrollView: {
        width: '100%',
    },
    anuncio: {
        flexDirection: 'row',
        alignItems: 'flex-start', // Ajusta la alineación vertical del contenido al inicio
        marginBottom: 10,
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 5,
        flexWrap: 'wrap', // Permite que el texto se ajuste al contenedor y se divida en varias líneas si es necesario
    },
    icono: {
        marginRight: 10,
    },
    infoTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    info: {
        fontSize: 16,
    },
    cerrasesion: {
        position: 'absolute',
        bottom: 20,
        left: 10, // Coloca el botón de cerrar sesión cerca del borde izquierdo
        right: 10, // Coloca el botón de cerrar sesión cerca del borde derecho
    },
});

export default Anuncios;
