# EmailJS Setup Guide for Tabata Welfare Association

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Add Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider:
   - **Gmail** (recommended for personal)
   - **Outlook** (recommended for business)
   - **Yahoo Mail**
   - **Custom SMTP**

4. Follow the setup wizard:
   - **For Gmail**: Allow EmailJS access to your Gmail
   - **For Outlook**: Sign in with your Microsoft account
   - **For Custom**: Enter your SMTP settings

5. **Test the service** to make sure it works
6. **Copy the Service ID** (you'll need this)

### Step 3: Create Email Template
1. Go to "Email Templates" in EmailJS dashboard
2. Click "Create New Template"
3. Use this template content:

**Subject:**
```
New Contact Message from {{from_name}} {{last_name}}
```

**Content:**
```
Dear {{to_name}},

You have received a new message from the Tabata Welfare Association website:

From: {{from_name}} {{last_name}}
Email: {{reply_to}}
Phone: {{phone_number}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from the contact form on {{website}}
Reply directly to this email to respond to {{from_name}}.
```

4. **Save the template**
5. **Copy the Template ID** (you'll need this)

### Step 4: Get Your User ID
1. Go to "Account" in EmailJS dashboard
2. Find your **User ID** (also called Public Key)
3. **Copy the User ID** (you'll need this)

### Step 5: Update Website Configuration
1. Open `/public/marketing/index.html`
2. Find this section around line 1470:

```javascript
const EMAILJS_CONFIG = {
    USER_ID: 'YOUR_EMAILJS_USER_ID',        // Replace with your User ID
    SERVICE_ID: 'YOUR_SERVICE_ID',          // Replace with your Service ID  
    TEMPLATE_ID: 'YOUR_TEMPLATE_ID'         // Replace with your Template ID
};
```

3. Replace the placeholder values with your actual IDs:

```javascript
const EMAILJS_CONFIG = {
    USER_ID: 'user_1234567890abcdef',       // Your actual User ID
    SERVICE_ID: 'service_gmail',            // Your actual Service ID
    TEMPLATE_ID: 'template_contact'         // Your actual Template ID
};
```

### Step 6: Test the Contact Form
1. Open your website: `http://127.0.0.1:8000`
2. Scroll to the Contact section
3. Fill out the form with test data
4. Click "Send Message"
5. Check your email inbox for the message

## 📧 Email Template Variables

The following variables are automatically filled from the contact form:

- `{{to_name}}` - Recipient name (Tabata Welfare Association)
- `{{from_name}}` - First name from form
- `{{last_name}}` - Last name from form
- `{{reply_to}}` - Email address from form (for replies)
- `{{phone_number}}` - Phone number from form
- `{{subject}}` - Selected subject from form
- `{{message}}` - Message content from form
- `{{website}}` - Website domain (twa.or.tz)

## 🎯 Free Plan Limits

EmailJS free plan includes:
- ✅ **200 emails per month**
- ✅ **Unlimited templates**
- ✅ **Basic support**
- ✅ **No credit card required**

For higher volume, upgrade to paid plans starting at $15/month.

## 🔧 Troubleshooting

### Common Issues:

**1. "User ID not found"**
- Check that you copied the User ID correctly
- Make sure you're using the Public Key, not Private Key

**2. "Service not found"**
- Verify the Service ID is correct
- Make sure the email service is properly configured

**3. "Template not found"**
- Check the Template ID is correct
- Ensure the template is saved and published

**4. "Failed to send email"**
- Check your email service connection
- Verify your email provider settings
- Test the service in EmailJS dashboard

### Testing Steps:
1. Test email service in EmailJS dashboard
2. Test template in EmailJS dashboard  
3. Check browser console for error messages
4. Verify all IDs are correctly copied

## 📞 Support

- **EmailJS Documentation**: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- **EmailJS Support**: Available in your dashboard
- **Community Forum**: [https://www.emailjs.com/community/](https://www.emailjs.com/community/)

## 🎉 Success!

Once configured, every message sent through your contact form will be delivered directly to your email inbox with all the contact details and message content.

**Example email you'll receive:**
```
Subject: New Contact Message from John Doe

You have received a new message from the Tabata Welfare Association website:

From: John Doe
Email: john@example.com
Phone: +255 123 456 789
Subject: Membership Information

Message:
Hello, I'm interested in joining the Tabata Welfare Association. 
Could you please provide more information about the membership 
process and requirements?

---
This message was sent from the contact form on tabatawelfare.org
```
