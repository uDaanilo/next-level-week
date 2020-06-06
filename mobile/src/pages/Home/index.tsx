import React, { useState, useEffect } from 'react'
import { View, ImageBackground, Text, Image, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather as Icon  } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import Select from 'react-native-picker-select'
import axios from 'axios'

interface IBGEStatesRes {
  nome: string
  sigla: string
}

interface IBGECityRes {
  nome: string
}

interface CityAndUf {
  label: string
  value: string
}

const Home = () => {
  const navigation = useNavigation()

  const [ufs, setUfs] = useState<CityAndUf[]>([])
  const [cities, setCities] = useState<CityAndUf[]>([])
  const [selectedUf, setSelectedUf] = useState("")
  const [selectedCity, setSelectedCity] = useState("0")

  useEffect(() => {
    axios.get<IBGEStatesRes[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then(res => {
        const formattedData = res.data.map(uf => {
          return {
            value: uf.sigla,
            label: uf.nome
          }
        })

        setUfs(formattedData)
      })
  }, [])

  useEffect(() => {
    axios.get<IBGECityRes[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(res => {
        const formattedData = res.data.map(city => {
          return {
            label: city.nome,
            value: city.nome
          }
        })

        setCities(formattedData)
      })
  }, [selectedUf])

  function handleNavigateToPoints() {
    navigation.navigate('Points', { uf: selectedUf, city: selectedCity })
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        imageStyle={{ width: 274, height: 368}}
        style={styles.container}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')}  />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de residuos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Select
            style={{ placeholder: { color: "#6C6C80" } }}
            onValueChange={val => setSelectedUf(val)}
            placeholder={{ label: "Selecione seu estado", value: "0" }}
            items={ufs}
          />
          <Select
            style={{ placeholder: { color: "#6C6C80" } }}
            onValueChange={val => setSelectedCity(val)}
            placeholder={{ label: "Selecione sua cidade", value: "0" }}
            items={cities}
          />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#fff" size={24} />
              </Text>
            </View>

            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home