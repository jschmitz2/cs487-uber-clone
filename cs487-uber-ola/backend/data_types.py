from typing import List, Optional
from sqlalchemy import Column, Integer, String, Date, ForeignKey, MetaData, DateTime, Date, Float
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
    pic = Column(String(128), nullable=True)
    salt = Column(String(32), nullable=False)
    hashed = Column(String(32), nullable=False)   
    phoneNumber = Column(String(16), nullable=False)
    licensePlate = Column(String(32), nullable=False)
    carMake = Column(String(32), nullable=False)
    carColor = Column(String(32), nullable=False)
    driverLicence = Column(String(32), nullable=False)
    numSeats = Column(Integer, nullable=False)
    ada = Column(Integer, nullable = False) 
    active = Column(Integer, nullable = False)


class DriverModel(BaseModel):
    
    id: Optional[int]
    fname: Optional[str]
    lname: Optional[str]
    email: Optional[str]
    password: Optional[str]
    pic: Optional[str]
    phoneNumber: Optional[str]
    licensePlate: Optional[str]
    carMake: Optional[str]
    carColor: Optional[str]
    driverLicence: Optional[str]
    numSeats: Optional[int]
    ada: Optional[int]
    active: Optional[int]
    token: Optional[str]

    class Config:
        orm_mode = True






class RiderORM(Base): 
    __tablename__ = "rider"
    metadata = metadata
    id = Column(Integer, nullable=False, primary_key=True)
    fname = Column(String(32), nullable=False)
    lname = Column(String(32), nullable=False)
    email = Column(String(32), nullable=False, unique=True)
    pic = Column(String(128), nullable=True)
    salt = Column(String(32), nullable=False)
    hashed = Column(String(32), nullable=False)
    phoneNumber = Column(String(16), nullable=False)
    ada = Column(Integer, nullable=True)

    favSpots = relationship("FavSpotsORM") 
    cards = relationship("CardsORM") 


class CardsModel(BaseModel):    
    id: Optional[int]
    number: Optional[str]
    expiration: Optional[str]
    cvc: Optional[str]
    token: Optional[str]

    class Config:
        orm_mode = True


class FavSpotsModel(BaseModel):

    id: Optional[int]
    location: Optional[str]

    class Config:
        orm_mode = True

class RiderModel(BaseModel):

    id: Optional[int]
    fname: Optional[str]
    lname: Optional[str]
    pic: Optional[str]
    email: Optional[str]
    creditCard: Optional[str]
    phoneNumber: Optional[str]
    ada: Optional[int]
    password: Optional[str]
    token: Optional[str]

    favSpots: Optional[List[FavSpotsModel]]
    cards: Optional[List[CardsModel]]

    class Config:
        orm_mode = True


class FavSpotsORM(Base):
    __tablename__ = "favspots"
    metadata = metadata
    id = Column(Integer, nullable=False, primary_key=True)
    location = Column(String(32), nullable=False)
    rid = Column(Integer, ForeignKey("rider.id"))


class CardsORM(Base):
    __tablename__ = "cards"
    metadata = metadata
    id = Column(Integer, nullable=False, primary_key=True)
    number = Column(Integer, nullable=False)
    expiration = Column(String(32))
    cvc = Column(String(3))
    rid = Column(Integer, ForeignKey("rider.id"))


class RideHistoryORM(Base):
    __tablename__ = "rideHistory"
    metadata = metadata
    id = Column(Integer, nullable=False, primary_key=True)
    sourceLat = Column(String(256), nullable=False)
    sourceLong = Column(String(256), nullable=False)
    destLat = Column(String(256), nullable=False)
    destLong = Column(String(256), nullable=False)
    price = Column(Float, nullable=False)
    riders = Column(Integer, nullable=False)
    time = Column(String(32))
    distance = Column(String(32), nullable=False)
    rid = Column(Integer, ForeignKey("rider.id")) 
    did = Column(Integer, ForeignKey("driver.id"))
    card_id = Column(Integer, ForeignKey("cards.id"))
    status = Column(Integer, nullable=False)
    dist_src = Column(String(32), nullable=False)
    time_src = Column(String(32), nullable=False)

class RideHistoryModel(BaseModel):
        
    id: Optional[int]
    sourceLat: Optional[str]
    sourceLong: Optional[str]
    destLat: Optional[str]
    destLong: Optional[str]
    price: Optional[float]
    riders: Optional[str]
    distance: Optional[str]
    time: Optional[str]
    rid: Optional[int]
    did: Optional[int]
    status: Optional[str]
    dist_src: Optional[str]
    time_src: Optional[str]
    token: Optional[str]
    card_id: Optional[int]
    
    class Config:
        orm_mode = True
    



#wingman stuff:


class TokenORM(Base):
    __tablename__ = "token"
    metadata = metadata
    id = Column(Integer, primary_key=True, nullable=False)
    val = Column(String(128), nullable=False)
    rid = Column(Integer, ForeignKey("rider.id"), nullable=True)
    did = Column(Integer, ForeignKey("driver.id"), nullable=True)

class TokenModel(BaseModel):
    val: str

    class Config:
        orm_mode = True
    



class NewRiderReturn(BaseModel):

    user: RiderModel
    token: TokenModel

    class Config:
        orm_mode = True




class NewDriverReturn(BaseModel):
    user: DriverModel
    token: TokenModel

    class Config:
        orm_mode = True

    

class LoginData(BaseModel):
    email: str
    password: str


class AuthIntModel(BaseModel):
    val: int
    token: str

