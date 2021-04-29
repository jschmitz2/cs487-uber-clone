from typing import List, Optional
from sqlalchemy import Column, Integer, String, Date, ForeignKey, MetaData, DateTime, Date
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel, constr
import datetime
from sqlalchemy.schema import UniqueConstraint


Base = declarative_base()
metadata = MetaData()


class DriverORM(Base):
    __tablename__ = "driver"
    metadata = metadata
    id = Column(String(32), nullable=False, primary_key=True)
    fname = Column(String(32), nullable=False)
    lname = Column(String(32), nullable=False)
    email = Column(String(32), nullable=False, unique=True)
    pic = Column(String(128))
    salt = Column(String(32), nullable=False)
    hashed = Column(String(32), nullable=False)   
    phoneNumber = Column(Integer, nullable=False)
    licensePlate = Column(String(32), nullable=False)
    carMake = Column(String(32), nullable=False)
    carColor = Column(String(32), nullable=False)
    driverLicence = Column(String(32), nullable=False)
    numSeats = Column(Integer, nullable=False)
    ada = Column(bool, nullable = False) 
    active = Column(bool, nullable = False)

    rides = relationship("RideHistory") #include ride id, user id, driver id, source, dest, price 
    
    tokens = relationship("TokenORM")





class DriverModel(BaseModel):
    class config:
        orm_mode = True

    
    id: Optional[int]
    fname: Optional[str]
    lname: Optional[str]
    password: Optional[str]
    email: Optional[str]
    pic: Optional[str]
    phoneNumber: Optional[int]
    licensePlate: Optional[str]
    carMake: Optional[str]
    carModel: Optional[str]
    driverLicence: Optional[str]
    numSeats: Optional[int]
    ada: Optional[bool]
    active: Optional[bool]







class RiderORM(Base): 
    __tablename__ = "rider"
    metadata = metadata
    id = Column(String(32), nullable=False)
    fname = Column(String(32), nullable=False)
    lname = Column(String(32), nullable=False)
    pic = Column(String(128))
    salt = Column(String(32), nullable=False)
    hashed = Column(String(32), nullable=False)
    creditCard = Column(String(32), nullable=False) #making it a part of rider instead of relation cuz it easier tbh - realistically this makes more sense as a table of cards, but ¯\_(ツ)_/¯ 
    phoneNumber = Column(Integer, nullable=False)
    ada = Column(bool, nullable = False)

    favSpots = relationship("FavSpotsORM") 
    tokens = relationship("TokenORM")
    creditCards = relationship("CardsORM") 


class RiderModel(BaseModel):
    class config:
        orm_mode = True


    id: Optional[int]
    fname: Optional[str]
    lname: Optional[str]
    pic: Optional[str]
    creditCard: Optional[str]
    phoneNumber: Optional[int]
    ada: Optional[bool]


class FavSpotsORM(Base):
    __tablename__ = "favspots"
    id: Column(Integer, primary_key=True, nullable=False)
    name: Column(String(32), nullable=False)
    location: Column(String(32), nullable=False)
    riderid: Column(Integer, ForeignKey("rider.id"))




class FavSpots(BaseModel):
    class config:
        orm_mode = True

    id: Optional[str]
    name: Optional[str]
    location: Optional[str]
