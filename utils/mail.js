//Import modules
const nodemailer = require("nodemailer");
//Import sensitive email information
require("dotenv").config();

const ticket_notification = (first,last,title,notify_message,newMessages = []) => {
    let textVersion = `This email is being sent to inform you that the ticket titled ${title} (created by ${first} ${last}) has been modified, and you are included as a contributer.  Below are more details.\nProblem Summary\n${notify_message}`;
    let htmlVersion = `<p>This email is being sent to inform you that the ticket titled <b>${title}</b> (created by ${first} ${last}) has been modified, and you are included as a contributer.  Below are more details.</p><h3>Problem Summary</h3><p>${notify_message}</p>`;
    if(newMessages.length > 0) {
        textVersion += `\nLatest Notes:\n\n${newMessages[0]}\n\n${newMessages[1]}\n\n${newMessages[2]}`;
        htmlVersion += `<h3>Latest Notes"</h3><ul><li>${newMessages[0]}</li><li>${newMessages[1]}</li><li>${newMessages[2]}</li></ul>`;
    }
    return [textVersion,htmlVersion];
};

async function assignTicket(senderInfo,recipientInfo,ticket_title,notification_message) {
    //senderInfo will be that user's first and last name
    //recipient info will be an array of email addresses
    //Process variables will be used for the actual sending account information
    const emails = recipientInfo.join(", ");

    const emailContent = ticket_notification(senderInfo.first_name,senderInfo.last_name,ticket_title,notification_message);
    
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    let emailData = await transporter.sendMail({
        from: `"${senderInfo.first_name} ${senderInfo.last_name}" <${process.env.EMAIL_USER}>`,
        to: emails,
        subject: `Tech Ticket Update: ${ticket_title}`,
        text: emailContent[0],
        html: emailContent[1]
    }, (err, info) => {
        if(err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });
}

module.exports = assignTicket;