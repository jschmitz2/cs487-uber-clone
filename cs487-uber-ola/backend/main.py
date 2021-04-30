from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from data_types import *
import random
import datetime
import bcrypt
import time
import uuid
from sqlalchemy import desc, asc, or_
from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
import requests
import json
import math

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = create_engine("sqlite:///test_db.db")
orm_parent_session = sessionmaker(bind=engine)
metadata.create_all(engine)
orm_session = orm_parent_session()


stages = {
    0: "Route is created, but not taken.",
    1: "Route is taken by the user.",
    2: "Driver is assigned to the route.",
    3: "Driver arrives at user source."
}



def gen_token():
    tok = str(uuid.uuid4().hex)[8:] + str(uuid.uuid4().hex)[8:]
    return tok

@app.get("/token/test")
def get_uid_token(token: str):
    """Tests if a token is valid. If invalid, sleep a little bit. FIXME THIS IS BAD"""
    s = orm_parent_session()
    try:
        t = s.query(TokenORM).filter(TokenORM.val == token).one()
        s.close()
        return {"result": token, "uid": t.uid}
    except NoResultFound:
        s.close()
        return {"result": 0, "uid": -1}



@app.post("/rider/login")
def login_rider(user_creds: LoginData):
    """Adds a new row to user table."""
    orm_session = orm_parent_session()
    # Generate a salt, then hash the password. 
    # Don't verify password strength here - do that on frontend. 

    try:
        user = orm_session.query(RiderORM).filter(RiderORM.email == user_creds.email).one()
    except NoResultFound:
        time.sleep(random.randrange(1,2))
        orm_session.close()
        raise HTTPException(400, "Email not found!")

    hashed = bcrypt.hashpw(bytes(user_creds.password, 'utf-8'), user.salt)

    if(hashed != user.hashed):
        orm_session.close()
        raise HTTPException(400, "Email not found!")

    token = gen_token()

    new_token_ORM = TokenORM(
        val = token,
        rid = user.id #this will be riderID
    )

    orm_session.add(new_token_ORM)
    orm_session.commit()

    # DEBUG: Add user to random number between 1 and 10 groups. 

    ret = NewRiderReturn(
        user = RiderModel.from_orm(user),
        token = TokenModel.from_orm(new_token_ORM)
    )
    orm_session.close()

    return ret


@app.post("/driver/login")
def login_driver(user_creds: LoginData):
    """Adds a new row to user table."""
    orm_session = orm_parent_session()
    # Generate a salt, then hash the password. 
    # Don't verify password strength here - do that on frontend. 

    try:
        user = orm_session.query(DriverORM).filter(DriverORM.email == user_creds.email).one()
    except NoResultFound:
        time.sleep(random.randrange(1, 2))
        orm_session.close()
        raise HTTPException(400, "Email not found!")

    hashed = bcrypt.hashpw(bytes(user_creds.password, 'utf-8'), user.salt)

    if(hashed != user.hashed):
        orm_session.close()
        raise HTTPException(400, "Email not found!")

    token = gen_token()

    new_token_ORM = TokenORM(
        val = token,
        did = user.id #this will be driverID
    )

    orm_session.add(new_token_ORM)
    orm_session.commit()

    # DEBUG: Add user to random number between 1 and 10 groups. 

    ret = NewDriverReturn(
        user = DriverModel.from_orm(user),
        token = TokenModel.from_orm(new_token_ORM)
    )
    orm_session.close()

    return ret




def getLongLat(list):
    geo = list[0]
    coords = geo['geometry']
    bounds = coords['bounds']
    northEastCoords = bounds["northeast"] #ive decided this are the coords we will use lol
    lat = northEastCoords["lat"]
    long = northEastCoords["lng"]

    return (long,lat)

def find_distance(lo1, la1, lo2, la2): #credit : https://www.kite.com/python/answers/how-to-find-the-distance-between-two-lat-long-coordinates-in-python
    R = 6373.0

    lat1 = math.radians(la1)
    lon1 = math.radians(lo1)
    lat2 = math.radians(la2)
    lon2 = math.radians(lo2)

    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance = R * c #in in km :/

    return str(distance)


def set_price(dist): #uber does $0.85 per mile plus $0.30 per minute
    price = float(dist)*(.85)*(.62) #1 km = 0.62 mile

    return str(round(price, 2))


@app.post("/rides/add")
def submit_route(src: str, dest: str, token: str):
    orm_session = orm_parent_session()
    rider = get_rider(token)
    

    urlSRC = requests.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + src.replace(" ", "+") + "&key=AIzaSyBoLGp9NmYUrAJj2AcQf6G4eelnfwX6R6I") 
    urlDEST = requests.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + dest.replace(" ", "+") + "&key=AIzaSyBoLGp9NmYUrAJj2AcQf6G4eelnfwX6R6I") 

    srcLat = urlSRC.json()["results"]
    
    srcCoords = getLongLat(srcLat)
    src_lat = srcCoords[0]
    src_long = srcCoords[1]
    
    destLat = urlDEST.json()["results"]
    
    destCoords = getLongLat(destLat)
    dest_lat = destCoords[0]
    dest_long = destCoords[1]

    distance = find_distance(src_long,src_lat,dest_long,dest_lat)

    #time =

    new_ride_orm = RideHistoryORM(
        sourceLat = src_lat,
        sourceLong = src_long,
        destLat = dest_lat,
        destLong = dest_long,
        price = set_price(distance),
        riders = 2, #how to set?
        time = datetime.datetime.now(),
        distance = distance,
        did = 0, #or null?
        rid = rider.id,
        status = 0, #init to 0 
        dist_src = "far", #how to get src lat and long?
        time_src = "long" #how to estimate time?
    )

    orm_session.add(new_ride_orm)
    orm_session.commit()
    ret = RideHistoryModel.from_orm(new_ride_orm)
    # ret.key = ret.id

    #check if success?

    orm_session.close()
    
    return ret


@app.get("/rides/id")
def getRouteByID(id: int):

    s = orm_parent_session()

    for r in s.query(RideHistoryORM).filter(RideHistoryORM.id == id):
        route = RideHistoryModel.from_orm(r)
        s.close()
        return route
    s.close()
    raise ValueError


@app.get("/driver/routes")
def getDriverRoutes(token: str, latititude: float, longitude: float, seats: int):

    s = orm_parent_session()
    driver = get_driver(token)

    routes = []

    for r in s.query(RideHistoryORM).filter(RideHistoryORM.status == 1, RideHistoryORM.riders < (seats+1)).order_by(asc(RideHistoryORM.riders)).all(): #idk if <= is supported lol i couldn't find it in the documentation so 
        routeFound = RideHistoryModel.from_orm(r)
        routes.append(routeFound)
        #calculate dist and time - update route

    
    s.close()
 
    return routes

@app.get("/driver/claim")
def driverClaimRoute(id: int, userRouteID: int): #id:int was token:str
    s = orm_parent_session()
    driver = get_driver(id)

    for r in s.query(RideHistoryORM).filter(RideHistoryORM.id == userRouteID):
        s.query(RideHistoryORM).filter(RideHistoryORM.id == userRouteID).update({RideHistoryORM.status: 2})
        s.query(RideHistoryORM).filter(RideHistoryORM.id == userRouteID).update({RideHistoryORM.did: id})
        s.commit() #i had forgotten this oops
        routeFound = RideHistoryModel.from_orm(r)

    return routeFound

@app.get("/rider/history")
def getRiderInfo(id: int): #was token : str
    s = orm_parent_session()
    rider = get_rider(id)

    rides = []

    for r in s.query(RideHistoryORM).filter(RideHistoryORM.rid == rider.id).all():
        rideFound = RideHistoryModel.from_orm(r)
        rides.append(rideFound)

    return rides

@app.get("/driver/history")
def getDriverInfo(id:int): #was token : str
    s = orm_parent_session()
    driver = get_driver(id)

    rides = []

    for r in s.query(RideHistoryORM).filter(RideHistoryORM.did == id).all():
        rideFound = RideHistoryModel.from_orm(r)
        rides.append(rideFound)

    return rides



def get_driver(id: int): #id:int was token:str

    s = orm_parent_session()
    for u in s.query(DriverORM).filter(DriverORM.id == id):
        driver = DriverModel.from_orm(u)
        s.close()
        return driver

    s.close()
    raise ValueError("No driver found :(")
    

def get_rider(id: int): #id:int was token:str
    s = orm_parent_session()

    for u in s.query(RiderORM).filter(RiderORM.id == id):
        rider = RiderModel.from_orm(u)
        s.close()
        return rider

    s.close()
    raise ValueError("No driver found :(")

@app.get("/rider/get")
def get_rider(token: str): #id:int was token:str

    rid = get_rid_token(token)["rid"]
    if(rid == -1):
        raise HTTPException(422, "User not found!")

    s = orm_parent_session()
    try:
        rider = RiderModel.from_orm(s.query(RiderORM).filter(RiderORM.id == rid).one())
        s.close()
        return rider
    except NoResultFound:
        raise HTTPException(422, "No rider found!")


def get_rid_token(token: str):
    s = orm_parent_session()
    try:
        t = s.query(TokenORM).filter(TokenORM.val == token).one()
        s.close()
        return {"result": token, "rid": t.rid}
    except NoResultFound:
        s.close()
        return {"result": 0, "rid": -1}

def get_did_token(token: str):
    s = orm_parent_session()
    try:
        t = s.query(TokenORM).filter(TokenORM.val == token).one()
        s.close()
        return {"result": token, "did": t.did}
    except NoResultFound:
        s.close()
        return {"result": 0, "did": -1}

@app.post("/rider/add")
def add_rider(new_user: RiderModel):
    """Adds a new row to rider table."""
    orm_session = orm_parent_session()
    # Generate a salt, then hash the password.
    # Don't verify password strength here - do that on frontend.

    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(bytes(new_user.password, 'utf-8'), salt)
    token = gen_token()

    new_user_ORM = RiderORM(
        fname=new_user.fname,
        lname=new_user.lname,
        salt=salt,
        hashed=hashed,
        email=new_user.email,
        pic=new_user.pic,
        phoneNumber=new_user.phoneNumber,
        ada = new_user.ada
    )

    try:
        orm_session.add(new_user_ORM)
        orm_session.commit()
    except Exception as e:
        # User failed to add. Almost certainly an IntegrityError.
        orm_session.close()
        raise HTTPException(
            400, "User already exists! Detailed message: " + str(e))

    new_token_ORM = TokenORM(
        val=token,
        rid=new_user_ORM.id
    )

    orm_session.add(new_token_ORM)
    orm_session.commit()

    ret = NewRiderReturn(
        user=RiderModel.from_orm(new_user_ORM),
        token=TokenModel.from_orm(new_token_ORM)
    )

    orm_session.commit()
    orm_session.close()
    return ret

@app.post("/driver/add")
def add_driver(new_user: DriverModel):
    """Adds a new row to driver table."""
    orm_session = orm_parent_session()
    # Generate a salt, then hash the password.
    # Don't verify password strength here - do that on frontend.

    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(bytes(new_user.password, 'utf-8'), salt)
    token = gen_token()

    new_user_ORM = DriverORM(
        fname=new_user.fname,
        lname=new_user.lname,
        salt=salt,
        hashed=hashed,
        email=new_user.email,
        pic=new_user.pic,
        phoneNumber=new_user.phoneNumber,
        licensePlate = new_user.licensePlate,
        carMake = new_user.carMake,
        carColor = new_user.carColor,
        driverLicence = new_user.driverLicence,
        numSeats = new_user.numSeats,
        ada = new_user.ada,
        active = 0
    )

    try:
        orm_session.add(new_user_ORM)
        orm_session.commit()
    except Exception as e:
        # User failed to add. Almost certainly an IntegrityError.
        orm_session.close()
        raise HTTPException(
            400, "User already exists! Detailed message: " + str(e))

    new_token_ORM = TokenORM(
        val=token,
        did=new_user_ORM.id
    )

    orm_session.add(new_token_ORM)
    orm_session.commit()



    ret = NewDriverReturn(
        user=DriverModel.from_orm(new_user_ORM),
        token=TokenModel.from_orm(new_token_ORM)
    )

    orm_session.commit()
    orm_session.close()
    return ret
