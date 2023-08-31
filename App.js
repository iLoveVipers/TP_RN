import { ImageBackground, FlatList, StyleSheet, Text, View, TouchableOpacity, CheckBox } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react';
import { Input } from 'react-native-elements'

export default function App() {
  const [text, onChangeText] = useState('')
  const [todoList, setTodoList] = useState([])

  const mainInput = useRef()
  useEffect(() => {
    const inicializarAsyncStorage = async () => {
      await AsyncStorage.setItem('@tareas', JSON.stringify(todoList))
      console.log('ASYNC STORAGE: ', await AsyncStorage.getItem('@tareas'))
    }
    inicializarAsyncStorage()
  }, [])

  const guardarTarea = async () => {
    var tarea = mainInput.current.props.value
    document
    try {
      const tareas = [...JSON.parse(await AsyncStorage.getItem('@tareas'))]
      tareas.push(tarea)
      setTodoList(tareas)
      await AsyncStorage.setItem('@tareas', JSON.stringify(tareas))
    } catch (err) {
      console.log(err)
      throw new Error('ERROR EN: guardarTarea')
    }
  }

  const eliminarTarea = async (tareaIndex) => {
    console.log('tareaIndex: ', tareaIndex)
    try {
      var tareas = [...JSON.parse(await AsyncStorage.getItem('@tareas'))]
      tareas = tareas.filter((tarea, index) => index !== tareaIndex)
      await AsyncStorage.setItem('@tareas', JSON.stringify(tareas))
      setTodoList(tareas)
    } catch (err) {
      console.log(err)
      throw new Error('ERROR EN: eliminarTarea')
    }
  }
  
  const handlePress = () => guardarTarea()

  return (
    <ImageBackground source={'https://i.pinimg.com/originals/17/26/c1/1726c1b216e4d3185696e57e8e86d2c1.jpg'} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.titulo}>LISTA DE TAREAS</Text>
        
        <Input id='tarea' onChangeText={onChangeText} value={text} placeholder="Agregar tarea...." style={styles.textogi} ref={mainInput}/>
        

        <View style={{display: 'flex', alignItems: 'center'}}>
          <TouchableOpacity style={styles.boton} onPress={handlePress}>
            <Text style={styles.texto}>Agregar tarea</Text>
          </TouchableOpacity>
        </View>
        
          <FlatList
          data={todoList}
          renderItem={({ item, index }) => (
            <View style={styles.cuadro}>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  style={styles.checkbox}
                />
                <Text style={styles.item}>{item}</Text>
                <TouchableOpacity  onPress={() => eliminarTarea(index)}>
                  <Icon icon="mdi:cancel-bold" style={{flex: 1, display: 'flex', alignSelf : 'center'}}/>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: '1.5rem',
  },
  texto:{
    fontSize: '1rem',
    color: 'white'
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  titulo: {
    textAlign: 'center',
    fontSize: '1.5rem',
    marginTop: '3rem',
    marginBottom: '2rem',
    fontWeight: '700',
    fontSize: 50,
    color: 'white',
  },
  boton: {
    borderRadius: 13,
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: '3rem',
    minWidth: '10rem',
    padding: 10,
    margin: '1rem'
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
  cuadro:{
    borderWidth: 2,
    borderRadius: 20,
    padding: "0.5rem",
    borderColor: "#EAF2F8 ",
    backgroundColor: 'white',
    marginBottom: '1rem',
    paddingLeft: '1rem',
  }
});
