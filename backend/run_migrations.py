"""
Script to run database migrations
Usage: python run_migrations.py [--prod-db-url=<url>]
"""
import sys
import os
import subprocess
from typing import Optional


def run_migrations(db_url: Optional[str] = None):
    """Run alembic migrations"""
    
    # Set database URL from environment or parameter
    if db_url:
        os.environ['DATABASE_URL'] = db_url
        print(f"Using provided database URL")
    elif 'DATABASE_URL' in os.environ:
        print(f"Using DATABASE_URL from environment")
    else:
        print("Warning: No DATABASE_URL provided, using default from config")
    
    # Get current revision
    print("\n=== Current database revision ===")
    subprocess.run(["alembic", "current"], check=False)
    
    # Show pending migrations
    print("\n=== Checking for pending migrations ===")
    result = subprocess.run(["alembic", "heads"], capture_output=True, text=True)
    print(result.stdout)
    
    # Run upgrade
    print("\n=== Running migrations ===")
    result = subprocess.run(["alembic", "upgrade", "head"], check=True)
    
    if result.returncode == 0:
        print("\n✅ Migrations completed successfully!")
        
        # Show new revision
        print("\n=== New database revision ===")
        subprocess.run(["alembic", "current"])
    else:
        print("\n❌ Migration failed!")
        sys.exit(1)


if __name__ == "__main__":
    db_url = None
    
    # Parse command line arguments
    for arg in sys.argv[1:]:
        if arg.startswith('--prod-db-url='):
            db_url = arg.split('=', 1)[1]
        elif arg.startswith('--db-url='):
            db_url = arg.split('=', 1)[1]
    
    run_migrations(db_url)

