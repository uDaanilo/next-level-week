import Knex from 'knex'

export async function seed(knex: Knex){
  const items = [
    { title: "Lampadas", image: 'lampadas.svg' },
    { title: "Pilhas e Baterias", image: 'bateria.svg' },
    { title: "Papeis e Papelao", image: 'papel.svg' },
    { title: "Residuos Eletronicos", image: 'eletronicos.svg' },
    { title: "Residuos organicos", image: 'organicos.svg' },
    { title: "Oleo de cozinha", image: 'oleo.svg' },
  ]

  await knex('items').insert(items)
}