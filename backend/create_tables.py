#!/usr/bin/env python3
"""
Directly create database tables using psycopg2
"""
import psycopg2
from psycopg2 import sql

# Neon connection (using non-pooled for admin operations)
conn_params = {
    'host': 'ep-super-truth-agjsq2st.c-2.eu-central-1.aws.neon.tech',
    'database': 'neondb',
    'user': 'neondb_owner',
    'password': 'npg_06TefxnrECmd',
    'port': 5432,
    'sslmode': 'require'
}

print("Connecting to Neon database...")
conn = psycopg2.connect(**conn_params)
conn.autocommit = False
cur = conn.cursor()

try:
    print("\n1. Creating alembic_version table...")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS alembic_version (
            version_num VARCHAR(32) NOT NULL,
            CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
        );
    """)
    
    print("2. Creating leads table...")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS leads (
            id SERIAL NOT NULL,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            company VARCHAR(255) NOT NULL,
            job_title VARCHAR(255) NOT NULL,
            phone VARCHAR(50),
            project_description TEXT NOT NULL,
            created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
            PRIMARY KEY (id)
        );
    """)
    
    print("3. Creating indexes...")
    
    # Index on id (primary key already creates this, but let's be explicit)
    cur.execute("""
        CREATE INDEX IF NOT EXISTS ix_leads_id ON leads (id);
    """)
    
    # Index on email
    cur.execute("""
        CREATE INDEX IF NOT EXISTS ix_leads_email ON leads (email);
    """)
    
    # Index on created_at
    cur.execute("""
        CREATE INDEX IF NOT EXISTS ix_leads_created_at ON leads (created_at);
    """)
    
    # Composite index on email and created_at
    cur.execute("""
        CREATE INDEX IF NOT EXISTS idx_leads_email_created ON leads (email, created_at);
    """)
    
    # Index on company
    cur.execute("""
        CREATE INDEX IF NOT EXISTS idx_leads_company ON leads (company);
    """)
    
    print("4. Inserting alembic version...")
    cur.execute("""
        INSERT INTO alembic_version (version_num) 
        VALUES ('732a9cab3950')
        ON CONFLICT (version_num) DO NOTHING;
    """)
    
    # Commit all changes
    conn.commit()
    
    print("\n" + "="*60)
    print("✅ Database tables created successfully!")
    print("="*60)
    
    # Verify
    print("\nVerifying tables...")
    cur.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)
    tables = cur.fetchall()
    print("\nTables created:")
    for table in tables:
        print(f"  ✓ {table[0]}")
    
    # Show leads table structure
    print("\nLeads table columns:")
    cur.execute("""
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'leads'
        ORDER BY ordinal_position;
    """)
    columns = cur.fetchall()
    for col in columns:
        nullable = "NULL" if col[2] == 'YES' else "NOT NULL"
        print(f"  ✓ {col[0]}: {col[1]} ({nullable})")
    
    # Show indexes
    print("\nLeads table indexes:")
    cur.execute("""
        SELECT indexname
        FROM pg_indexes
        WHERE schemaname = 'public' AND tablename = 'leads'
        ORDER BY indexname;
    """)
    indexes = cur.fetchall()
    for idx in indexes:
        print(f"  ✓ {idx[0]}")
    
    print("\n" + "="*60)
    
except Exception as e:
    conn.rollback()
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
finally:
    cur.close()
    conn.close()

