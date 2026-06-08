import customtkinter as ctk
import sqlite3
from tkinter import messagebox

# ================= DATABASE =================

conn = sqlite3.connect("hospital.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS patients(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER,
    gender TEXT,
    phone TEXT,
    email TEXT,
    password TEXT
)
""")

conn.commit()

# ================= FUNCTIONS =================

def register_patient():
    name = name_entry.get()
    age = age_entry.get()
    gender = gender_entry.get()
    phone = phone_entry.get()
    email = email_entry.get()
    password = password_entry.get()

    if name == "" or age == "" or gender == "" or phone == "" or email == "" or password == "":
        messagebox.showerror("Error", "Please fill all fields")
        return

    cursor.execute("""
    INSERT INTO patients
    (name, age, gender, phone, email, password)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (name, age, gender, phone, email, password))

    conn.commit()

    messagebox.showinfo("Success", "Patient Registered Successfully")

    name_entry.delete(0, "end")
    age_entry.delete(0, "end")
    gender_entry.delete(0, "end")
    phone_entry.delete(0, "end")
    email_entry.delete(0, "end")
    password_entry.delete(0, "end")


# ================= GUI =================

ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

app = ctk.CTk()
app.title("Hospital Appointment System")
app.geometry("900x650")

title = ctk.CTkLabel(
    app,
    text="🏥 Hospital Appointment System",
    font=("Arial", 30, "bold")
)
title.pack(pady=20)

frame = ctk.CTkFrame(app)
frame.pack(pady=20, padx=20, fill="both", expand=True)

heading = ctk.CTkLabel(
    frame,
    text="Patient Registration",
    font=("Arial", 24, "bold")
)
heading.pack(pady=15)

name_entry = ctk.CTkEntry(frame, width=300, placeholder_text="Full Name")
name_entry.pack(pady=10)

age_entry = ctk.CTkEntry(frame, width=300, placeholder_text="Age")
age_entry.pack(pady=10)

gender_entry = ctk.CTkEntry(frame, width=300, placeholder_text="Gender")
gender_entry.pack(pady=10)

phone_entry = ctk.CTkEntry(frame, width=300, placeholder_text="Phone Number")
phone_entry.pack(pady=10)

email_entry = ctk.CTkEntry(frame, width=300, placeholder_text="Email")
email_entry.pack(pady=10)

password_entry = ctk.CTkEntry(
    frame,
    width=300,
    placeholder_text="Password",
    show="*"
)
password_entry.pack(pady=10)

register_btn = ctk.CTkButton(
    frame,
    text="Register Patient",
    command=register_patient,
    width=300,
    height=40
)
register_btn.pack(pady=20)

app.mainloop()

conn.close()