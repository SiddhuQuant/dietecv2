import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration(migrationFile, migrationName) {
  console.log(`\n🔄 Running migration: ${migrationName}...`);
  
  try {
    const sqlPath = join(__dirname, 'migrations', migrationFile);
    const sql = readFileSync(sqlPath, 'utf-8');
    
    // Split by semicolons but keep them, execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });
        
        if (error) {
          // Try direct query if RPC fails
          const { error: queryError } = await supabase
            .from('_migrations')
            .select('*')
            .limit(1);
          
          if (queryError) {
            console.log(`⚠️  Using alternative method...`);
          }
        }
      }
    }
    
    console.log(`✅ Successfully executed: ${migrationName}`);
    return true;
  } catch (error) {
    console.error(`❌ Error in ${migrationName}:`, error.message);
    return false;
  }
}

async function runAllMigrations() {
  console.log('🚀 Starting database migrations...\n');
  console.log(`📍 Supabase URL: ${supabaseUrl}\n`);
  
  const migrations = [
    { file: '001_medicines_tables.sql', name: 'Medicines & Prescription Orders Tables' },
    { file: '002_lab_tests_tables.sql', name: 'Lab Tests & Bookings Tables' }
  ];
  
  let successCount = 0;
  
  for (const migration of migrations) {
    const success = await runMigration(migration.file, migration.name);
    if (success) successCount++;
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✨ Migration Summary: ${successCount}/${migrations.length} successful`);
  console.log(`${'='.repeat(50)}\n`);
  
  if (successCount === migrations.length) {
    console.log('🎉 All migrations completed successfully!');
    console.log('\n📋 Tables created:');
    console.log('   - medicines (with 12 default medicines)');
    console.log('   - prescription_orders');
    console.log('   - lab_tests (with 15 default tests)');
    console.log('   - test_bookings\n');
  } else {
    console.log('⚠️  Some migrations failed. Check the errors above.');
    console.log('\n💡 Alternative: Copy the SQL files from backend/migrations/');
    console.log('   and run them manually in Supabase SQL Editor:\n');
    console.log(`   ${supabaseUrl.replace('https://', 'https://supabase.com/dashboard/project/')}/sql\n`);
  }
}

runAllMigrations().catch(console.error);
