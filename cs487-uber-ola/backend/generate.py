from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from data_types import *
import datetime
from main import *
import faker
import random
import os
from sqlalchemy.exc import IntegrityError


engine = create_engine("sqlite:///test_db.db")
orm_parent_session = sessionmaker(bind=engine)
metadata.create_all(engine)