const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function runMigration() {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf8'
    )
    
    await pool.query(sql)
    console.log('✅ Migration completed successfully!')
    console.log('All tables created or verified')
  } catch (error) {
    console.error('❌ Migration failed:', error)
  } finally {
    await pool.end()
  }
}

runMigration()
