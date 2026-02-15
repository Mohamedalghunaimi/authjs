import { Resend } from 'resend';

const resend = new Resend(process.env.app_key);

resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'mhamednabil242@gmail.com',
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
})


export async function sendLinkToVerifyEmail(email:string,link:string) {
    const resend = new Resend(process.env.app_key);

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'verify email',
        html: `
        <a href="${link}" >
        click here to verify email
        </a>
        `
    })
}

export async function sendLinkToResetPassword(email:string,link:string) {
    const resend = new Resend(process.env.app_key);

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'change password',
        html: `
        <a href="${link}" >
        click here to verify email
        </a>
        `
    })
}

export async function sendTwoFactorToken(email:string,token:string) {
    const resend = new Resend(process.env.app_key);

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'two factor verification',
        html: `
        <h1>
        verification token :${token}
        </h1>

        `
    })
}