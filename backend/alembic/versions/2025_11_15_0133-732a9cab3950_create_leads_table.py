"""create leads table

Revision ID: 732a9cab3950
Revises: 
Create Date: 2025-11-15 01:33:43.960758

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '732a9cab3950'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create leads table
    op.create_table(
        'leads',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('company', sa.String(length=255), nullable=False),
        sa.Column('job_title', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=50), nullable=True),
        sa.Column('project_description', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes
    op.create_index(op.f('ix_leads_id'), 'leads', ['id'], unique=False)
    op.create_index(op.f('ix_leads_email'), 'leads', ['email'], unique=False)
    op.create_index(op.f('ix_leads_created_at'), 'leads', ['created_at'], unique=False)
    op.create_index('idx_leads_email_created', 'leads', ['email', 'created_at'], unique=False)
    op.create_index('idx_leads_company', 'leads', ['company'], unique=False)


def downgrade() -> None:
    # Drop indexes
    op.drop_index('idx_leads_company', table_name='leads')
    op.drop_index('idx_leads_email_created', table_name='leads')
    op.drop_index(op.f('ix_leads_created_at'), table_name='leads')
    op.drop_index(op.f('ix_leads_email'), table_name='leads')
    op.drop_index(op.f('ix_leads_id'), table_name='leads')
    
    # Drop table
    op.drop_table('leads')

