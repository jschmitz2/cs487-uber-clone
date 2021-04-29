from typing import List, Optional
from sqlalchemy import Column, Integer, String, Date, ForeignKey, MetaData, DateTime, Date, Boolean
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
    id = Column(Integer, nullable=False, primary_key=True)
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
    ada = Column(Boolean, nullable = False) 
    active = Column(Boolean, nullable = False)

    ride_id = Column(String(32), ForeignKey("rideHistory.id"))

    rides = relationship("RideHistoryORM") #include ride id, user id, driver id, source, dest, price 
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
    id = Column(Integer, nullable=False, primary_key=True)
    fname = Column(String(32), nullable=False)
    lname = Column(String(32), nullable=False)
    email = Column(String(32), nullable=False, unique=True)
    pic = Column(String(128))
    salt = Column(String(32), nullable=False)
    hashed = Column(String(32), nullable=False)
    creditCard = Column(String(32), nullable=False) #making it a part of rider instead of relation cuz it easier tbh - realistically this makes more sense as a table of cards, but ¯\_(ツ)_/¯ 
    phoneNumber = Column(Integer, nullable=False)
    ada = Column(Boolean, nullable = False)


    ride_id = Column(Integer, ForeignKey("rideHistory.id"))

    favSpots = relationship("FavSpotsORM") 
    tokens = relationship("TokenORM")
    cards = relationship("CardsORM") 
    rides = relationship("RideHistoryORM")


class RiderModel(BaseModel):
    class config:
        orm_mode = True


    id: Optional[int]
    fname: Optional[str]
    lname: Optional[str]
    pic: Optional[str]
    email: Optional[str]
    creditCard: Optional[str]
    phoneNumber: Optional[int]
    ada: Optional[bool]


class FavSpotsORM(Base):
    __tablename__ = "favspots"
    id = Column(Integer, nullable=False, primary_key=True)
    name = Column(String(32), nullable=False)
    location = Column(String(32), nullable=False)
    rid = Column(Integer, ForeignKey("rider.id"))




class FavSpotsModel(BaseModel):
    class config:
        orm_mode = True

    id: Optional[int]
    name: Optional[str]
    location: Optional[str]

class CardsORM(Base):
    __tablename__ = "cards"
    id = Column(Integer, nullable=False, primary_key=True)
    name = Column(String(32), nullable=False)
    number = Column(Integer, nullable=False)
    rid = Column(Integer, ForeignKey("rider.id"))

class CardsModel(BaseModel):
    class config:
        orm_mode = True
    
    id: Optional[int]
    name: Optional[str]
    number: Optional[str]

class RideHistoryORM(Base):
    __tablename__ = "rideHistory"
    id = Column(Integer, nullable=False, primary_key=True)
    source = Column(String(256), nullable=False)
    dest = Column(String(256), nullable=False)
    price = Column(String(32), nullable=False)
    riders = Column(Integer, nullable=False)
    time = Column(DateTime)
    distance = Column(String(32), nullable=False)
    rid = Column(Integer, ForeignKey("rider.id")) 
    did = Column(Integer, ForeignKey("driver.id")) 
    status = Column(Integer, nullable=False)
    dist_src = Column(String(32), nullable=False)
    time_src = Column(String(32), nullable=False)

class RideHistoryModel(BaseModel):
    class config:
        orm_mode = True
    
    id: Optional[int]
    source: Optional[str]
    dest: Optional[str]
    price: Optional[str]
    time: Optional[datetime.datetime]
    did: Optional[int]
    rid: Optional[int]
    status: Optional[str]
    token: Optional[str]
    
    



#wingman stuff:


class TokenORM(Base):
    __tablename__ = "token"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    val = Column(String(128), nullable=False)
    rid = Column(Integer, ForeignKey("rider.id"), nullable=True)
    did = Column(Integer, ForeignKey("driver.id"), nullable=True)

class TokenModel(BaseModel):
    class Config:
        orm_mode = True
    val: str




class NewRiderReturn(BaseModel):
    user: RiderModel
    token: TokenModel


class NewDrivereturn(BaseModel):
    user: DriverModel
    token: TokenModel


class LoginData(BaseModel):
    email: str
    password: str


class AuthIntModel(BaseModel):
    val: int
    token: str


class NewDriverReturn(BaseModel):
    user: DriverModel
    token: TokenModel


class NewRiderReturn(BaseModel):
    user: RiderModel
    token: TokenModel