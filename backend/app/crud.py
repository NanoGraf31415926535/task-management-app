from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
from . import models, schemas
from .auth_utils import get_password_hash

# User Operations
def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        name=user.name, 
        email=user.email, 
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

# Task Operations
def create_task(db: Session, task: schemas.TaskCreate, user_id: int):
    db_task = models.Task(**task.dict(), owner_id=user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_tasks(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(models.Task)
        .filter(models.Task.owner_id == user_id)
        .order_by(desc(models.Task.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_task_by_id(db: Session, task_id: int, user_id: int):
    return (
        db.query(models.Task)
        .filter(models.Task.id == task_id, models.Task.owner_id == user_id)
        .options(joinedload(models.Task.comments))
        .first()
    )

def update_task(db: Session, task_id: int, task_update: schemas.TaskCreate, user_id: int):
    db_task = get_task_by_id(db, task_id, user_id)
    if not db_task:
        return None
    
    for key, value in task_update.dict(exclude_unset=True).items():
        setattr(db_task, key, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int, user_id: int):
    db_task = get_task_by_id(db, task_id, user_id)
    if not db_task:
        return False
    
    db.delete(db_task)
    db.commit()
    return True

# Comment Operations
def create_comment(db: Session, comment: schemas.CommentCreate, task_id: int, user_id: int):
    db_comment = models.Comment(
        content=comment.content, 
        task_id=task_id, 
        user_id=user_id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def get_task_comments(db: Session, task_id: int, user_id: int):
    return (
        db.query(models.Comment)
        .join(models.Task)
        .filter(models.Comment.task_id == task_id, models.Task.owner_id == user_id)
        .order_by(desc(models.Comment.created_at))
        .all()
    )