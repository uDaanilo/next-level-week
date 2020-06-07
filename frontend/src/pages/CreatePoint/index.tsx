import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import api from '../../services/api'
import axios from 'axios'

import './styles.css'

import logo from '../../assets/logo.svg'

import Dropzone from '../../components/Dropzone'

interface Item {
  id: number
  title: string
  image: string
  image_url: string
}

interface FormData {
  name: string
  email: string
  whatsapp: any
}

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

const CreatePoint = () => {
  const history = useHistory()

  const [items, setItems] = useState<Item[]>([])
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  const [initialPos, setInitialPos] = useState<[number, number]>([0, 0])
  const [selectedPos, setSelectedPos] = useState<[number, number]>([0, 0])
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectedFile, setSelectedFile] = useState<File>()

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    whatsapp: ''
  })

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      setInitialPos([pos.coords.latitude, pos.coords.longitude])
    })
  }, [])

  useEffect(() => {
    api.get('items')
      .then(res => {
        setItems(res.data)
      })
  }, [])

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(res => {
        const ufInitials = res.data.map(uf => uf.sigla)

        setUfs(ufInitials)
      })
  }, [])

  useEffect(() => {
    if(selectedUf === '0') return

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(res => {
        const cityNames = res.data.map(city => city.nome)

        setCities(cityNames)
      })
  }, [selectedUf])

  function handleSelectedUf(e: ChangeEvent<HTMLSelectElement>){
    setSelectedUf(e.target.value)
  }

  function handleSelectedCity(e: ChangeEvent<HTMLSelectElement>){
    setSelectedCity(e.target.value)
  }

  function handleMapClick(e: LeafletMouseEvent){
    setSelectedPos([e.latlng.lat, e.latlng.lng])
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>){
    const { name, value } = e.target

    setFormData({ ...formData, [name]: value})
  }

  function handleSelectItem(id: number){
    const alreadySelected = selectedItems.findIndex(item => item === id)

    if(alreadySelected !== -1){
      const filteredItems = selectedItems.filter(item => item !== id)

      setSelectedItems(filteredItems)
    }else{
      setSelectedItems([...selectedItems, id])
    }

  }

  async function handleSubmit(e: FormEvent){
    e.preventDefault()

    const { name, email, whatsapp } = formData
    const uf = selectedUf
    const city = selectedCity
    const [lat, long] = selectedPos
    const items = selectedItems

    if(isNaN(whatsapp)) return alert('Numero invalido')

    const data = new FormData()

    data.append('name', name)
    data.append('email', email)
    data.append('whatsapp', whatsapp)
    data.append('uf', uf)
    data.append('city', city)
    data.append('lat', String(lat))
    data.append('long', String(long))
    data.append('items', items.join(','))
    if(selectedFile) data.append('image', selectedFile)

    await api.post('/points', data)

    history.push('/')
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br/> ponto de coleta</h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereco</h2>
          </legend>

          <Map center={initialPos} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPos} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="text"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereco</h2>
            <span>Selecione o endereco no mapa</span>
          </legend>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select onChange={handleSelectedUf} value={selectedUf} name="uf" id="uf">
                <option value="0">Selecione um estado</option>
                {ufs.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select onChange={handleSelectedCity} name="city" id="city">
                <option value="0">Selecione uma cidade</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>

          <ul className='items-grid'>
            {items.map(item => (
              <li key={item.id} className={selectedItems.includes(item.id) ? 'selected': ''} onClick={() => handleSelectItem(item.id)}>
                <img src={item.image_url} alt={item.title}/>
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  )
}

export default CreatePoint