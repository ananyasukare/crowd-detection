Smart Queue Alert Management System - Backend

This folder contains a Flask backend scaffold for the Smart Queue Alert Management System.

Setup (example):

1. Create a Python virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file in this folder with DATABASE_URI and JWT_SECRET_KEY, SECRET_KEY.

4. Initialize DB and run migrations (Flask-Migrate):

```bash
export FLASK_APP=app.py
flask db init
flask db migrate -m "init"
flask db upgrade
```

5. Run the dev server:

```bash
python app.py
```

Notes:
- Database credentials will be provided by the user later; update `DATABASE_URI` in the `.env` file.
- Alert sending is a placeholder in `utils/alert_service.py`.
