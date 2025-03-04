# Full Stack Task Management Project

This project is a full-stack task management application built with React (Vite) for the frontend and FastAPI (Python) for the backend.

## Project Structure

```
task-management-app/
├── frontend/             # React Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/              # Python Backend (FastAPI)
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   └── requirements.txt
├── shared/               # Shared utilities
│   └── validators.js
└── README.md
```

## Setup Instructions

### Prerequisites

* Node.js and npm (or yarn)
* Python 3.7+

### Frontend Setup

1.  Create React + Vite project:

    ```bash
    npm create vite@latest frontend -- --template react
    cd frontend
    npm install tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    npm install axios react-router-dom
    ```

2.  Start the development server:

    ```bash
    npm run dev
    ```

### Backend Setup

1.  Create Python virtual environment:

    ```bash
    python -m venv backend/venv
    source backend/venv/bin/activate  # On Linux/macOS
    backend\venv\Scripts\activate  # On Windows
    ```

2.  Install dependencies:

    ```bash
    pip install -r backend/requirements.txt
    ```

3.  Run the backend server:

    ```bash
    uvicorn backend.main:app --reload
    ```

### Recommended Development Tools

* VS Code
* Python extension
* React/JavaScript extension
* Tailwind CSS IntelliSense

## Backend Details:

### backend/main.py

This file contains the FastAPI application and API endpoints.

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import uvicorn
from . import models, database
from sqlalchemy.orm import Session
from fastapi import Depends

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Task(BaseModel):
    title: str
    description: str = ""
    completed: bool = False

    class Config:
        orm_mode = True

@app.get("/api/tasks", response_model=List[Task])
async def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(models.Task).all()
    return tasks

@app.post("/api/tasks", response_model=Task)
async def create_task(task: Task, db: Session = Depends(get_db)):
    db_task = models.Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}

@app.put("/api/tasks/{task_id}", response_model=Task)
async def update_task(task_id: int, updated_task: Task, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in updated_task.dict().items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

```

### backend/models.py

This file defines the SQLAlchemy models for the database.

```python
from sqlalchemy import Column, Integer, String, Boolean
from .database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    completed = Column(Boolean, default=False)
```

### backend/database.py

This file sets up the database connection and SQLAlchemy engine.

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./tasks.db" #Example of a sqlite database.

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False} #remove check same thread for production.
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
```

### backend/requirements.txt

This file lists the Python dependencies.

```
fastapi
uvicorn
sqlalchemy
pydantic
```

## Frontend Details:

The frontend is a React application built with Vite and Tailwind CSS. It provides a user interface for managing tasks.

## Future Improvements

* Implement user authentication and authorization.
* Add more features to the frontend, such as task filtering and sorting.
* Add Unit and Integration testing.
* Deployment instructions.
* Improve error handling.

## Running the application.

1.  Start the backend server: `uvicorn backend.main:app --reload`
2.  Start the frontend server: `npm run dev`
3.  Open your browser and navigate to `http://localhost:5173` (or the port Vite assigns).
4.  The backend api is available at `http://localhost:8000/docs`
