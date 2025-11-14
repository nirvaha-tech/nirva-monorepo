#!/usr/bin/env python3
"""
Test inserting a lead into the database
"""
import psycopg2
from datetime import datetime

# Neon connection
conn_params = {
    'host': 'ep-super-truth-agjsq2st.c-2.eu-central-1.aws.neon.tech',
    'database': 'neondb',
    'user': 'neondb_owner',
    'password': 'npg_06TefxnrECmd',
    'port': 5432,
    'sslmode': 'require'
}

print("Testing database insert...")
conn = psycopg2.connect(**conn_params)
cur = conn.cursor()

try:
    # Insert a test lead
    print("\n1. Inserting test lead...")
    cur.execute("""
        INSERT INTO leads (name, email, company, job_title, phone, project_description, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id, name, email, company;
    """, (
        'Test User',
        'test@nirvahatech.com',
        'Nirvahatech',
        'CTO',
        '+1-555-0123',
        'Testing the database connection and lead insertion functionality.',
        datetime.utcnow(),
        datetime.utcnow()
    ))
    
    result = cur.fetchone()
    conn.commit()
    
    print(f"✅ Lead created successfully!")
    print(f"   ID: {result[0]}")
    print(f"   Name: {result[1]}")
    print(f"   Email: {result[2]}")
    print(f"   Company: {result[3]}")
    
    # Count total leads
    print("\n2. Counting total leads...")
    cur.execute("SELECT COUNT(*) FROM leads;")
    count = cur.fetchone()[0]
    print(f"✅ Total leads in database: {count}")
    
    # Show all leads
    print("\n3. All leads:")
    cur.execute("""
        SELECT id, name, email, company, created_at 
        FROM leads 
        ORDER BY created_at DESC;
    """)
    leads = cur.fetchall()
    for lead in leads:
        print(f"   - [{lead[0]}] {lead[1]} ({lead[2]}) from {lead[3]} - {lead[4]}")
    
    print("\n" + "="*60)
    print("✅ Database is working perfectly!")
    print("="*60 + "\n")
    
except Exception as e:
    conn.rollback()
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
finally:
    cur.close()
    conn.close()

