"""
CogFlow Database Module
=======================
SQLAlchemy ORM models & SQLite connection for User Profiles,
Session Logs, and Learned Topic History.
"""

import os
import json
import uuid
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'cogflow.db')
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    """User profile with personal baseline calibration and preferences."""
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: f"usr_{uuid.uuid4().hex[:8]}")
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=True)
    avatar = Column(String(20), default="🎓")
    grade_level = Column(String(100), default="B.Tech Computer Science")
    created_at = Column(DateTime, default=datetime.utcnow)
    last_active = Column(DateTime, default=datetime.utcnow)

    # Personal baseline calibration for MediaPipe / DAiSEE
    baseline_brow = Column(Float, default=0.005)
    baseline_squint = Column(Float, default=0.35)
    preferred_tier = Column(String(20), default="tier3")

    # Relationships
    sessions = relationship("LearningSession", back_populates="user", cascade="all, delete-orphan")
    topic_mastery = relationship("TopicProgress", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "avatar": self.avatar,
            "grade_level": self.grade_level,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "last_active": self.last_active.isoformat() if self.last_active else None,
            "baseline_brow": self.baseline_brow,
            "baseline_squint": self.baseline_squint,
            "preferred_tier": self.preferred_tier
        }


class LearningSession(Base):
    """Complete record of a learning session with cognitive telemetry."""
    __tablename__ = "learning_sessions"

    id = Column(String, primary_key=True, default=lambda: f"ses_{uuid.uuid4().hex[:10]}")
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    subject = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    duration_seconds = Column(Integer, default=0)
    
    # Cognitive load telemetry aggregates
    avg_cognitive_load = Column(Float, default=50.0)
    time_in_flow_secs = Column(Integer, default=0)
    time_in_overload_secs = Column(Integer, default=0)
    time_in_boredom_secs = Column(Integer, default=0)
    
    initial_tier = Column(String(20), default="tier3")
    final_tier = Column(String(20), default="tier3")
    adaptations_count = Column(Integer, default=0)

    # JSON stored fields for complex structures
    topics_json = Column(Text, default="[]")       # List of topic names covered
    adaptation_log_json = Column(Text, default="[]") # Detailed timeline of tier shifts

    user = relationship("User", back_populates="sessions")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "subject": self.subject,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "duration_seconds": self.duration_seconds,
            "avg_cognitive_load": round(self.avg_cognitive_load, 1),
            "time_in_flow_secs": self.time_in_flow_secs,
            "time_in_overload_secs": self.time_in_overload_secs,
            "time_in_boredom_secs": self.time_in_boredom_secs,
            "initial_tier": self.initial_tier,
            "final_tier": self.final_tier,
            "adaptations_count": self.adaptations_count,
            "topics": json.loads(self.topics_json) if self.topics_json else [],
            "adaptation_log": json.loads(self.adaptation_log_json) if self.adaptation_log_json else []
        }


class TopicProgress(Base):
    """Tracks learned history and mastery level per topic."""
    __tablename__ = "topic_progress"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    subject = Column(String(100), nullable=False)
    topic_name = Column(String(150), nullable=False)
    highest_tier_reached = Column(String(20), default="tier3")
    times_reviewed = Column(Integer, default=1)
    last_reviewed = Column(DateTime, default=datetime.utcnow)
    mastery_score = Column(Float, default=70.0) # 0 to 100

    user = relationship("User", back_populates="topic_mastery")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "subject": self.subject,
            "topic_name": self.topic_name,
            "highest_tier_reached": self.highest_tier_reached,
            "times_reviewed": self.times_reviewed,
            "last_reviewed": self.last_reviewed.isoformat() if self.last_reviewed else None,
            "mastery_score": round(self.mastery_score, 1)
        }


def init_db():
    """Create all tables and seed a default student profile if empty."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if default user exists
        default_user = db.query(User).filter(User.id == "usr_default").first()
        if not default_user:
            default_user = User(
                id="usr_default",
                name="Prathamesh",
                email="prathamesh@cogflow.ai",
                avatar="🚀",
                grade_level="B.Tech Computer Science",
                baseline_brow=0.005,
                baseline_squint=0.35,
                preferred_tier="tier3"
            )
            db.add(default_user)
            db.commit()
            print("[Database] Initialized cogflow.db and created default student profile: Prathamesh")
        else:
            print("[Database] SQLite database connected.")
    finally:
        db.close()


def get_db():
    """FastAPI dependency for database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
