from flask import Flask, flash, render_template, request, session
from sqlalchemy import create_engine, Column, Integer, String, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
import os

engine = create_engine('sqlite:///assignment3.db', echo=True)
Base = declarative_base()
db_session = scoped_session(sessionmaker(bind=engine))

class User(Base):
    __tablename__ = "users"

    username = Column(String, primary_key=True)
    password = Column(String)
    type = Column(String)

    def __init__(self, username, password, type):
        self.username = username
        self.password = password
        self.type = type

class Grade(Base):
    __tablename__ = "grades"

    id = Column(Integer, primary_key=True)
    username = Column(String)
    score = Column(String)
    total = Column(String)
    type = Column(String)
    name = Column(String)
    date = Column(String)

    def __init__(self, username, score, total, type, name, date):
        self.username = username
        self.score = score
        self.total = total
        self.type = type
        self.name = name
        self.date = date

class Student(Base):
    __tablename__ = "students"

    username = Column(String, primary_key=True)
    instructor = Column(String)

    def __init__(self, username, instructor):
        self.username = username
        self.instructor = instructor

class Remark(Base):
    __tablename__ = "remark"

    id = Column(Integer, primary_key=True)
    username = Column(String)
    name = Column(String)
    comments = Column(String)

    def __init__(self, username, name, comments):
        self.username = username
        self.name = name
        self.comments = comments

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True)
    username = Column(String)
    instructor = Column(String)
    feedback = Column(String)

    def __init__(self, username, instructor, feedback):
        self.username = username
        self.instructor = instructor
        self.feedback = feedback

Base.metadata.create_all(engine)

app = Flask(__name__)

@app.route("/")
def home():
    if not session.get("logged_in"):
        return render_template("login.html", instructors=db_session.query(User).filter(User.type == "instructor").all())
    else:
        user = db_session.query(User).filter(User.username.in_([session["username"]])).first()
        if user.type == "instructor":
            grades = db_session.query(Grade).join(Student, Student.username == Grade.username).filter(
                Student.instructor.in_([session["username"]])).all()
            instructor = True
            total = db_session.query(func.max(Grade.id)).scalar()
            studentsInstructor = db_session.query(Student).filter(Student.instructor.in_([session["username"]])).all()
            feedback = db_session.query(Feedback).filter(Feedback.instructor.in_([session["username"]])).all()
            comments = db_session.query(Remark).join(Student, Remark.username == Student.username).filter(
                Student.instructor.in_([session["username"]]))
            return render_template("index.html", grades=grades, instructor=instructor, total=total,
                                   studentsInstructor=studentsInstructor, feedback=feedback, comments=comments)

        elif user.type == "student":
            grades = db_session.query(Grade).filter(Grade.username.in_([session["username"]])).all()
            instructor = False
            instructorList = db_session.query(User).filter(User.type == "instructor").all()
            return render_template("index.html", grades=grades, instructor=instructor, instructorList=instructorList)

@app.route("/register", methods=["POST", "GET"])
def register():
    if request.method == "POST":
        username = str(request.form["username"])
        password = str(request.form["password"])
        reenter = str(request.form["reenter-password"])
        accountType = str(request.form["account-type"])
        exists = db_session.query(User).filter(User.username == str(request.form["username"])).first()

        if exists:
            flash("Username has been taken")
        elif password != reenter:
            flash("Passwords does not match")
        else:
            user = User(username, password, accountType)
            db_session.add(user)
            if accountType == "student":
                student = Student(username, str(request.form["choose-instructor"]))
                db_session.add(student)
            db_session.commit()
            flash("Account created")
        return home()

@app.route("/login", methods=["POST", "GET"])
def do_admin_login():
    if request.method == "POST":
        if request.form["username"] and request.form["password"]:
            POST_USERNAME = str(request.form["username"])
            POST_PASSWORD = str(request.form["password"])

            user = db_session.query(User).filter(User.username.in_([POST_USERNAME]),
                                                 User.password.in_([POST_PASSWORD])).first()

            if user:
                session["logged_in"] = True
                session["username"] = POST_USERNAME
            else:
                flash("Incorrect username/password. Please try again")
    return home()

@app.route("/logout")
def logout():
    session["logged_in"] = False
    return home()

@app.route("/save", methods=["POST", "GET"])
def save():
    if request.method == "POST":
        grade = db_session.query(Grade).filter(Grade.id == request.form["id"]).first()

        if grade and request.form["action"] == "update":
            grade.id = request.form["id"]
            grade.username = request.form["username"]
            grade.name = request.form["name"]
            grade.date = request.form["date"]
            grade.score = request.form["score"]
            grade.total = request.form["total"]
            grade.type = request.form["type"]
        elif request.form["action"] == "add":
            grade = Grade(request.form["username"], request.form["score"], request.form["total"], request.form["type"],
                          request.form["name"], request.form["date"])
            grade.id = request.form["id"]
            db_session.add(grade)
        elif grade and request.form["action"] == "delete":
            db_session.delete(grade)
        db_session.commit()
    return home()

@app.route("/feedback", methods=["POST", "GET"])
def feedback():
    if request.method == "POST":
        db_session.add(Feedback(str(request.form["username"]), str(request.form["choose-instructor"]),
                                str(request.form["feedback"])))
        db_session.commit()
    return home()

@app.route("/remark", methods=["POST", "GET"])
def remark():
    if request.method == "POST":
        db_session.add(Remark(str(request.form["username"]), str(request.form["name"]), str(request.form["comments"])))
        db_session.commit()
    return home()

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

if __name__ == "__main__":
    app.secret_key = os.urandom(12)
    app.run(host="0.0.0.0", port=5000, debug=True)
