"""empty message

Revision ID: 16a9d10320f6
Revises: ae4d9c38563f
Create Date: 2025-03-19 21:40:04.801642

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '16a9d10320f6'
down_revision = 'ae4d9c38563f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('doctors', schema=None) as batch_op:
        batch_op.drop_column('city')
        batch_op.drop_column('country')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('doctors', schema=None) as batch_op:
        batch_op.add_column(sa.Column('country', sa.VARCHAR(length=80), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('city', sa.VARCHAR(length=80), autoincrement=False, nullable=False))

    # ### end Alembic commands ###
