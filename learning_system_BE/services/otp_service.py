import pyotp
import smtplib
from email.message import EmailMessage
from flask import current_app

def generate_otp(secret):
    totp = pyotp.TOTP(secret, interval=120)
    return totp.now()

def verify_otp(secret, otp_input):
    totp = pyotp.TOTP(secret, interval=120)
    return totp.verify(otp_input)

def send_otp_email(receiver_email, otp):
    message = EmailMessage()
    message['Subject'] = 'Your OTP Code'
    message['From'] = current_app.config['EMAIL_USER']
    message['To'] = receiver_email
    message.set_content(f"Your OTP is: {otp}")

    with smtplib.SMTP_SSL(current_app.config['EMAIL_HOST'], current_app.config['EMAIL_PORT']) as smtp:
        smtp.login(current_app.config['EMAIL_USER'], current_app.config['EMAIL_PASS'])
        smtp.send_message(message)
