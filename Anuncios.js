import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ImageBackground, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';

const Anuncios = ({ Deslogeado }) => {
    const [data, setData] = useState([]);

    async function cargarDatos() {
        try {
            const anunciosSnapshot = await firestore().collection('Anuncios').get();
            const anunciosData = anunciosSnapshot.docs.map(doc => {
                return { id: doc.id, ...doc.data() };
            });
            setData(anunciosData);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        cargarDatos();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.anuncio}>
            <Icon name="newspaper" size={24} color="#333" style={styles.icono} />
            <View>
                <Text style={styles.infoTitulo}>{item.Titulo}</Text>
                <Text style={styles.info}>{item.Mensaje}</Text>
            </View>
        </View>
    );

    return (
        <ImageBackground
            source={require('./Imagenes/fondo.jpg')}
            style={styles.background}
            imageStyle={{ resizeMode: 'cover' }}
        >
            <View style={styles.anuncioContainer}>
                <Text style={styles.title}>Anuncios</Text>
            </View>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listaAnuncios}
            />

            <View style={styles.cerrasesion}>
                <Button title="Cerrar sesión" onPress={Deslogeado} />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 80,
    },
    cerrasesion: {
        position: 'absolute',
        bottom: 20,
        
    },
    anuncioContainer: {
        width: '80%',
        maxWidth: 400,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        
    },
    listaAnuncios: {
        width: '80%',
        maxWidth: 400,
    },
    anuncio: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        marginBottom: 20,
    },
    icono: {
        marginRight: 10,
    },
    infoTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    info: {
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default Anuncios;
