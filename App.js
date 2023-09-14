import {FlatList, StyleSheet, Text, View, Button, TextInput, Pressable, TouchableOpacity, CheckBox } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react';
import { Input } from 'react-native-elements'

export default function App() {
  const [text, onChangeText] = useState('')
  const [texto, onTexto] = useState([])
  const [listaTareas, setListaTareas] = useState([])
  const [checks, setChecks] = useState([]);
  const handleSelect = index => {
    let newSelection = [...checks]
    newSelection[index] = !newSelection[index]
    setChecks(newSelection)
  }

  const mainInput = useRef()

  useEffect(() => {
    const inicializarAsyncStorage = async () => {
      try {
        const storedData = await AsyncStorage.getItem('@tareas');
        if (storedData !== null) {
          setListaTareas(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Error initializing AsyncStorage:', error);
      }
    };
  
    inicializarAsyncStorage();
  }, []);
  

  const guardarTarea = async () => {
    const tarea = mainInput.current.props.value;
    try {
      const tareas = [...listaTareas, tarea];
      setListaTareas(tareas);
      await AsyncStorage.setItem('@tareas', JSON.stringify(tareas));
    } catch (err) {
      console.log(err);
      throw new Error('ERROR EN: guardarTarea');
    }
  };
  const eliminarTarea = async (tareaIndex) => {
    console.log('tareaIndex: ', tareaIndex)
    try {
      var tareas = [...JSON.parse(await AsyncStorage.getItem('@tareas'))]
      tareas = tareas.filter((tarea, index) => index !== tareaIndex)
      await AsyncStorage.setItem('@tareas', JSON.stringify(tareas))
      setListaTareas(tareas)
    } catch (err) {
      console.log(err)
      throw new Error('ERROR EN: eliminarTarea')
    }
  }

  const handlePress = () => guardarTarea()

  return (
      <View style={styles.container}>

        <Text style={styles.titulo}>Lista de Tareas 📝</Text>
        <Input
        id='tarea'
          onChangeText={onChangeText}
          value={text}
          placeholder="Ingresar tarea"
          ref={mainInput}
          style={styles.mainInput}
        />
        <View style={styles.posicionCentrado} >

        <Pressable style={styles.pressable} onPress={handlePress}>
  <Text>Agregar Tarea</Text>
</Pressable>
        </View>

        
          <FlatList
          data={listaTareas} style={styles.algomas}
          renderItem={({ item, index }) => (
            <View style={styles.cuadro}>
            <View style={styles.checkboxContainer}>
              <CheckBox
                style={styles.checkbox}
                value={checks[index]}
                onValueChange={() => handleSelect(index)}
              />
              {
                checks[index] ? <Text style={styles.itemTachado}>{item}</Text> : <Text style={styles.item}>{item}</Text>
              }
              <TouchableOpacity  onPress={() => eliminarTarea(index)}>
                <Icon icon="ph:trash-bold" style={{flex: 1, display: 'flex', alignSelf : 'center'}}/>
              </TouchableOpacity>
            </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        
        
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    margin: '2rem',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  titulo: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: '1.5rem',
    marginTop: '3rem',
    marginBottom: '2rem',
    fontWeight: '700',
    fontSize: 35,
  },
  posicionCentrado: {
    display: 'flex',
    alignItems: 'center'
  },
  background: {
    width: '100%'
  },
  checkboxContainer: {
    flexDirection: 'row',
    
  },
  checkbox: {
    alignSelf: 'center',
  },
  algomas:{
    padding: '1rem'
  },
  cuadro:{
    padding: "0.5rem",
    backgroundColor: '#fcfcfc',
    marginBottom: '1rem',
    paddingLeft: '1rem',
    shadowColor: '#000000',
    shadowOffset: {width: 1, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 17,
    borderRadius: "2rem"
  },

  mainInput: {
    backgroundColor: '#e3e3e3de',
    borderRadius: 5
  },
  itemTachado:{
    padding: 10,
    fontSize: 18,
    height: 44,
    textDecorationLine: 'line-through'
  },
  pressable:{
    borderRadius: 20,
    backgroundColor: '#fcfcfc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: '3rem',
    minWidth: '10rem',
    text: 'ffffff',
    color: '#ffffff',
    padding: 10,
    margin: '1rem',
  borderRadius: "50px",
  shadowColor: '#000000',
  shadowOffset: {width: 1, height: 5},
  shadowOpacity: 0.2,
  shadowRadius: 17,

  }
});
