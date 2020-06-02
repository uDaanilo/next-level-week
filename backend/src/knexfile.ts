import path from 'path'
import Knex from 'knex'

const development: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, 'db', 'dev.sqlite')
  },
  migrations: {
    directory: path.resolve(__dirname, 'db', 'migrations')
  },
  seeds: {
    directory: path.resolve(__dirname, 'db', 'seeds')
  },
  useNullAsDefault: true
}

export default { development }