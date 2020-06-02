import knex from 'knex'
import path from 'path'
import dbConfig from '../knexfile'

const connection = knex(dbConfig.development)

export default connection