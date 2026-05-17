from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from app.core.config import settings
from typing import List
import os

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME or "",
    MAIL_PASSWORD=settings.MAIL_PASSWORD or "",
    MAIL_FROM=settings.MAIL_FROM or "noreply@example.com",
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER or "smtp.gmail.com",
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

class NotificationService:
    async def send_email(self, subject: str, recipients: List[str], body: str):
        if not settings.MAIL_USERNAME:
            print(f"Mail credentials not set. Simulation: Sending email to {recipients} with subject {subject}")
            return
            
        message = MessageSchema(
            subject=subject,
            recipients=recipients,
            body=body,
            subtype="html"
        )
        
        fm = FastMail(conf)
        await fm.send_message(message)

    def get_html_template(self, title, content, cta_text=None, cta_link=None):
        return f"""
        <html>
            <body style="font-family: 'Inter', sans-serif; background-color: #f8fafc; padding: 40px; color: #1e293b;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                    <div style="background: #4f46e5; padding: 30px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; text-transform: uppercase;">CrowdSync</h1>
                        <p style="margin-top: 5px; opacity: 0.8; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">AI-Powered Queue Management</p>
                    </div>
                    <div style="padding: 40px;">
                        <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 20px; color: #1e293b;">{title}</h2>
                        <div style="font-size: 15px; line-height: 1.6; color: #64748b;">
                            {content}
                        </div>
                        {f'<a href="{cta_link}" style="display: block; text-align: center; background: #4f46e5; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 800; margin-top: 30px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">{cta_text}</a>' if cta_text else ''}
                    </div>
                    <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
                        This is an automated notification from CrowdSync. Please do not reply to this email.
                    </div>
                </div>
            </body>
        </html>
        """

    async def send_booking_confirmation(self, email: str, token_number: int, office_name: str):
        subject = f"Booking Confirmed: Token #{token_number}"
        content = f"""
            Your token has been successfully booked for <b>{office_name}</b>.<br><br>
            <div style="background: #eef2ff; padding: 20px; border-radius: 16px; border: 1px solid #e0e7ff; text-align: center; margin: 20px 0;">
                <span style="font-size: 12px; font-weight: 800; color: #4f46e5; text-transform: uppercase; display: block; margin-bottom: 5px;">Your Token Number</span>
                <span style="font-size: 48px; font-weight: 900; color: #4f46e5;">#{token_number}</span>
            </div>
            Please keep this email for your visit. Our AI is monitoring the live crowd and will notify you when your turn is approaching.
        """
        body = self.get_html_template("Great! Your booking is confirmed.", content, "Track Live Progress", f"{settings.FRONTEND_URL}/my-tokens")
        await self.send_email(subject, [email], body)

    async def send_turn_alert(self, email: str, token_number: int):
        subject = "Action Required: Your Turn is Coming Soon!"
        content = f"""
            Our AI has detected that your turn for token <b>#{token_number}</b> is approaching.<br><br>
            We estimate that you will be called in about <b>10-15 minutes</b>. Please start your journey now to avoid missing your slot.
        """
        body = self.get_html_template("Time to get moving!", content, "View Live Queue Status", f"{settings.FRONTEND_URL}/my-tokens")
        await self.send_email(subject, [email], body)

notification_service = NotificationService()
