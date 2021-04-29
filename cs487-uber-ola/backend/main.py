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

class HelloResponse(BaseModel):
    name: str
    message: str


engine = create_engine("sqlite:///test_db.db")
orm_parent_session = sessionmaker(bind=engine)
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
        time.sleep(random.randrange(.5, 2))
        orm_session.close()
        raise HTTPException(400, "Email not found!")

    hashed = bcrypt.hashpw(bytes(user_creds.password, 'utf-8'), user.salt)

    if(hashed != user.hashed):
        orm_session.close()
        raise HTTPException(400, "Email not found!")

    token = gen_token()

    new_token_ORM = TokenORM(
        val = token,
        uid = user.id #this will be riderID
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
        time.sleep(random.randrange(.5, 2))
        orm_session.close()
        raise HTTPException(400, "Email not found!")

    hashed = bcrypt.hashpw(bytes(user_creds.password, 'utf-8'), user.salt)

    if(hashed != user.hashed):
        orm_session.close()
        raise HTTPException(400, "Email not found!")

    token = gen_token()

    new_token_ORM = TokenORM(
        val = token,
        uid = user.id #this will be riderID
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








@app.post("")#add endpoint route here
def submit_route(src: str, dest: str, token: str):
    orm_session = orm_parent_session()
    UId = get_uid_token(new_post.token)["uid"]



    
    new_ride_orm = RideHistoryORM(
        src = new_ride.source,
        dest = new_ride.dest,
        time = datetime.datetime.now(),
        did = new_ride.did,
        rid = new_ride.rid,
        status = stages.get(0)
    )

    orm_session.add(new_ride_orm)
    orm_session.commit()
    ret = RideHistoryModel.from_orm(new_ride_orm)
    ret.key = ret.id

    #check if success

    orm_session.close()
    
    return ret


@app.get("rides/id")
def getRouteByID(id: str):

    s = orm_parent_session()

    for r in s.query(RideHistoryORM).filter(RideHistoryORM.id == id):
        route = RideHistoryModel.from_orm(r)
        s.close()
        return route
    s.close()
    raise ValueError


#not endpoint i think
def get_driver(token: str):

    s = orm_parent_session
    for u in s.query(DriverORM).filter(DriverORM.token == token):
        driver = DriverModel.from_orm(u)
        s.close()
        return driver

    s.close()
    raise ValueError("No driver found :(")
    

    pass

@app.get("driver/routes")
def getDriverRoutes(token: str, latititude: str, longitude: str, seats: int):

    s = orm_parent_session
    driver = get_driver(token)

    routes = []

    for r in s.query(RideHistoryORM).filter(RideHistoryORM.status == 1).order_by(asc(RideHistoryORM.riders)).all():
        routeFound = RideHistoryORM.from_orm(r)
        routes.append(routeFound)
        #calculate dist and time - adjust route?
        #build route object?

    
    s.close()
 
    return routes

def driverClaimRoute(token: str, userRouteID: int):
    s = orm_parent_session
    driver = get_driver(token)

    for r in s.query(RideHistoryORM).filter(RideHistoryORM.id == userRouteID):
        routeFound = RideHistoryORM.from_orm(r)
        #setStatus to 2
        #give did the driver id

    pass


def getRiderRides(token: str):
    s = orm_parent_session
    pass

def getDriverRides(token: str):
    s = orm_parent_session
    pass



