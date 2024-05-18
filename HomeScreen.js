import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = () => {
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
        <View style={styles.anuncioContainer}>
            <Text style={styles.titulo}>{item.Titulo}</Text>
            <Text style={styles.mensaje}>{item.Mensaje}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Anuncios</Text>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 30,        
        paddingTop: 80



    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    anuncioContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    mensaje: {
        fontSize: 16,
    },
});

export default HomeScreen;
