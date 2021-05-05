# Starting Development Servers

## Running the Frontend Development Server

Change directory from the root to `/cs487-uber-ola`.

Run: 

```bash
npm install
# this will take a while
npm start
```

To install on a production server: 

```bash
npm run build
```

## Running the Backend Server

From the root directory of the repo, make a new python virtual environment. 

```bash
python -m venv venv
```
(Note the second "venv" is the name of the virtual environment - "venv" is the convention)

Activate the virtual environment. 

```bash
# Windows
.\venv\scripts\activate
# Linux
source venv/bin/activate
```

Then, install the requirements:
```bash
pip install -r requirements.txt
```

Then, change directory to the "/cs487-uber-ola/backend" folder. 

```bash
cd ipro-intern-project
cd backend
```

Then, start the development server: 

```bash
# Windows
.\start.bat
# Linux
source start.bat
```

Once you're in, start by making a new user account at http://localhost:3000/register. You'll have to make a driver account and a rider account to see the full functionality of the application. 