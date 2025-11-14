#!/usr/bin/env python3
"""
Check database schema and tables
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
try:
    conn = psycopg2.connect(**conn_params)
    cur = conn.cursor()
    
    print("\n" + "="*60)
    print("DATABASE SCHEMA INSPECTION")
    print("="*60)
    
    # Check all tables in public schema
    print("\n1. All tables in 'public' schema:")
    print("-" * 60)
    cur.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)
    tables = cur.fetchall()
    if tables:
        for table in tables:
            print(f"  - {table[0]}")
    else:
        print("  (No tables found)")
    
    # Check if leads table exists
    print("\n2. Checking for 'leads' table:")
    print("-" * 60)
    cur.execute("""
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'leads'
        );
    """)
    leads_exists = cur.fetchone()[0]
    print(f"  Leads table exists: {leads_exists}")
    
    # If leads exists, show its structure
    if leads_exists:
        print("\n3. Leads table structure:")
        print("-" * 60)
        cur.execute("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'leads'
            ORDER BY ordinal_position;
        """)
        columns = cur.fetchall()
        for col in columns:
            print(f"  - {col[0]}: {col[1]} (nullable: {col[2]}, default: {col[3]})")
        
        print("\n4. Leads table indexes:")
        print("-" * 60)
        cur.execute("""
            SELECT indexname, indexdef
            FROM pg_indexes
            WHERE schemaname = 'public' AND tablename = 'leads';
        """)
        indexes = cur.fetchall()
        for idx in indexes:
            print(f"  - {idx[0]}")
    
    # Check alembic_version table
    print("\n5. Alembic version table:")
    print("-" * 60)
    cur.execute("""
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'alembic_version'
        );
    """)
    alembic_exists = cur.fetchone()[0]
    print(f"  Alembic version table exists: {alembic_exists}")
    
    if alembic_exists:
        cur.execute("SELECT version_num FROM alembic_version;")
        version = cur.fetchone()
        if version:
            print(f"  Current migration version: {version[0]}")
        else:
            print("  (No version recorded)")
    
    # Check all schemas
    print("\n6. All schemas in database:")
    print("-" * 60)
    cur.execute("""
        SELECT schema_name 
        FROM information_schema.schemata 
        ORDER BY schema_name;
    """)
    schemas = cur.fetchall()
    for schema in schemas:
        print(f"  - {schema[0]}")
    
    print("\n" + "="*60)
    print("✅ Database inspection complete!")
    print("="*60 + "\n")
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()

