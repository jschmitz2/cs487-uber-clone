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
import key

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
    bounds = coords['location']
    northEastCoords = bounds #ive decided this are the coords we will use lol
    lat = northEastCoords["lat"] #changed to use location instead of bounds, just don't feel like renaming lol
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



def googleMapsTimeDist(lo1,la1,lo2,la2): #cuz i return time then dist

    slo1 = str(lo1).replace(" ", "")
    sla1 = str(la1).replace(" ", "")
    slo2 = str(lo2).replace(" ", "")
    sla2 = str(la2).replace(" ", "")

    origin = "origin=" + sla1 + "," + slo1
    destination = "destination=" + sla2 + "," + slo2
    thekey = "key=" + key.key

    url = "https://maps.googleapis.com/maps/api/directions/json?" + str(origin) + "&" + str(destination) +"&" + thekey

    googleReturn = requests.get(url)
    src = googleReturn.json()["routes"]
    dict = src[0]
    legs = dict["legs"]
    next = legs[0]

    duration = next["duration"]
    dist = next["distance"]

    durTime = duration["text"]
    durDist = dist["text"]

    return (durTime, durDist)




def set_price(dist): #uber does $0.85 per mile plus $0.30 per minute
    priceDist = float(dist[1].split()[0])*(.85) 
    if('hours' in dist[0]):
        list = dist[0].split()
        priceTime = float(list[0])*60*.3 + float(list[2])*.3
    else:
        priceTime = float(dist[0].split()[0])*(0.30)

    price = priceDist + priceTime
    return str(round(price, 2))


@app.post("/rides/add")
def submit_route(src: str, dest: str, token: str, riders: int):
    orm_session = orm_parent_session()
    rid = get_rid_token(token)["rid"]
    if(rid == -1):
        raise HTTPException(422, "User not found!")
    

    urlSRC = requests.get("https://maps.googleapis.com/maps/api/geocode/json", params={"address": src, "key": key.key})
    urlDEST = requests.get("https://maps.googleapis.com/maps/api/geocode/json", params={"address": dest, "key": key.key})

    srcLat = urlSRC.json()["results"]
    
    srcCoords = getLongLat(srcLat)
    src_lat = srcCoords[1]
    src_long = srcCoords[0]
    
    destLat = urlDEST.json()["results"]
    
    destCoords = getLongLat(destLat)
    dest_lat = destCoords[1]
    dest_long = destCoords[0]

    distance = googleMapsTimeDist(src_long, src_lat, dest_long, dest_lat)

    price = (float(distance[0].split()[0]) * 1 + float(distance[1].split()[0]) * 0.30 + 2.00) * math.log(riders + math.e)

    new_ride_orm = RideHistoryORM(
        sourceLat = src_lat,
        sourceLong = src_long,
        destLat = dest_lat,
        destLong = dest_long,
        price = set_price(distance),
        riders = riders, # how to set?
        time = distance[0], #distance[0] is time of trip
        distance = distance[1],
        did = 0, #or null?
        rid = rid,
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


@app.post("/rides/id/complete")
def completeRide(id:int):
    s = orm_parent_session()

    for r in s.query(RideHistoryORM).filter(RideHistoryORM.id == id):
        s.query(RideHistoryORM).filter(RideHistoryORM.id == id).update({RideHistoryORM.status: 3})
        s.commit()
        route = RideHistoryModel.from_orm(r)
        s.close()
        return route
    s.close()
    raise ValueError


@app.post("/rides/confirm")
def requestRide(id: int, card_id: int, token: str):

    rid = get_rid_token(token)["rid"]
    if(rid == -1):
        raise HTTPException(422, "User not found!")
    
    s = orm_parent_session()
    try:
        r = s.query(RideHistoryORM).filter(RideHistoryORM.id == id).one()
    except Exception as e:
        raise HTTPException(450, "Error! " + str(e))
    
    if r.rid != rid:
        raise HTTPException(430, "Unauthenticated!")

    r.status = 1 
    r.card_id = card_id 
    s.commit()
    route = RideHistoryModel.from_orm(r)
    s.close()
    return route

@app.get("/driver/routes")
def getDriverRoutes(token: str, latititude: float, longitude: float):

    did = get_did_token(token)["did"]
    if(did == -1):
        raise HTTPException(422, "User not found!")

    s = orm_parent_session()
    seats = get_driver(token).numSeats

    routes = []

    for r in s.query(RideHistoryORM).filter(RideHistoryORM.status == 1, RideHistoryORM.riders < (seats+1)): #idk if <= is supported lol i couldn't find it in the documentation so 
        routeFound = RideHistoryModel.from_orm(r)
        srcLat = routeFound.sourceLat
        srcLng = routeFound.sourceLong
        routes.append(routeFound)
        distTime = googleMapsTimeDist(srcLng,srcLat,longitude,latititude)
        time = distTime[0]
        dist = distTime[1]
        s.query(RideHistoryORM).filter(RideHistoryORM.status == 1, RideHistoryORM.riders < (seats+1)).update({RideHistoryORM.time_src: time})
        s.query(RideHistoryORM).filter(RideHistoryORM.status == 1, RideHistoryORM.riders < (seats+1)).update({RideHistoryORM.dist_src: dist})
        s.commit()

    s.close()
 
    return routes

@app.post("/driver/claim")
def driverClaimRoute(token: str, userRouteId: int, newStatus: int):
    did = get_did_token(token)["did"]
    if(did == -1):
        raise HTTPException(422, "User not found!")

    s = orm_parent_session()
    try:
        r = s.query(RideHistoryORM).filter(RideHistoryORM.id == userRouteId).one()
    except Exception as e:
        raise HTTPException(430, "Error! " + str(e))
    
    r.status = newStatus
    r.did = did
    s.commit()
    ret = RideHistoryModel.from_orm(r)
    return ret

@app.get("/rider/history")
def getRiderInfo(token:str): #was token : str
    s = orm_parent_session()
    rid = get_rid_token(token)["rid"]
    if(rid == -1):
        raise HTTPException(422, "User not found!")

    rides = []

    for r in s.query(RideHistoryORM).filter(RideHistoryORM.rid == rid).all():
        rideFound = RideHistoryModel.from_orm(r)
        rides.append(rideFound)

    return rides

@app.get("/driver/history")
def getDriverInfo(token:str): 
    s = orm_parent_session()
    did = get_did_token(token)["did"]
    if(did == -1):
        raise HTTPException(422, "User not found!")

    rides = []

    for r in s.query(RideHistoryORM).filter(RideHistoryORM.did == did).all():
        rideFound = RideHistoryModel.from_orm(r)
        rides.append(rideFound)

    return rides

@app.get("/rider/get")
def get_rider(token: str):

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

def get_driver(token: str):

    did = get_did_token(token)["did"]
    if(did == -1):
        raise HTTPException(422, "User not found!")

    s = orm_parent_session()
    try:
        driver = DriverModel.from_orm(s.query(DriverORM).filter(DriverORM.id == did).one())
        s.close()
        return driver
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

@app.post("/rider/fav_loc/add")
def add_fav_loc(token: str, newLoc: str):
    rid = get_rid_token(token)["rid"]
    if(rid == -1):
        raise HTTPException(422, "User not found!")
    
    s = orm_parent_session()
    f = FavSpotsORM(location=newLoc, rid=rid)
    s.add(f)
    s.commit()
    s.close()
    return get_rider(token)

@app.post("/rider/cards/add")
def add_fav_loc(newCard: CardsModel):
    rid = get_rid_token(newCard.token)["rid"]
    if(rid == -1):
        raise HTTPException(422, "User not found!")
    
    s = orm_parent_session()
    c = CardsORM(
        number=newCard.number,
        expiration=newCard.expiration,
        cvc=newCard.cvc,
        rid=rid)

    s.add(c)
    s.commit()
    s.close()

    return get_rider(newCard.token)


@app.get("rider/summary")
def get_rider_summary(token: str):

    rid = get_rid_token(token)["rid"]
    if(rid == -1):
        raise HTTPException(422, "User not found!")

    s = orm_parent_session()
    total = 0
    try:
        for r in s.query(RideHistoryORM).filter(RideHistoryORM.rid == rid):
            routeFound = RideHistoryModel.from_orm(r)
            price = routeFound.price
            total = total + price

        return total

    except NoResultFound:
        raise HTTPException(422, "No rider found!")


@app.get("driver/summary")
def get_driver(token: str):

    did = get_did_token(token)["did"]
    if(did == -1):
        raise HTTPException(422, "User not found!")

    s = orm_parent_session()
    total = 0
    try:
        for r in s.query(RideHistoryORM).filter(RideHistoryORM.did == did):
            routeFound = RideHistoryModel.from_orm(r)
            price = routeFound.price
            total = total + price

        return total

    except NoResultFound:
        raise HTTPException(422, "No driver found!")