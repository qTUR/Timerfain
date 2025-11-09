RFQH Email Countdown (Outlook‑safe)

This is a tiny Vercel Edge Function that renders a LIVE image (PNG) with an Arabic countdown to a fixed launch date. Because it’s an image, it works in Outlook, Gmail, Apple Mail, mobile clients, etc.

How it works
- The email contains an <img> whose `src` points to the deployed endpoint.
- Every open fetches a freshly rendered image showing the time remaining.
- We pass a fixed UTC deadline to avoid timezone drift.

Quick start
1) Install Vercel CLI (or use the Dashboard):
   npm i -g vercel

2) Deploy:
   vercel --yes

3) Your endpoint will be at something like:
   https://YOUR-DEPLOYMENT.vercel.app/api/countdown?deadline=2025-02-23T21:00:00Z

   Note: 2025‑02‑24 00:00 (+03:00 Riyadh) equals 2025‑02‑23T21:00:00Z. Change `deadline` if your launch time differs.

Email embed (copy into your HTML email)

<img
  src="https://YOUR-DEPLOYMENT.vercel.app/api/countdown?deadline=2025-02-23T21:00:00Z&title=%D8%A7%D9%84%D8%A7%D8%B7%D9%84%D8%A7%D9%82%20%D8%A7%D9%84%D8%AA%D8%AC%D8%B1%D9%8A%D8%A8%D9%8A&bg=%231f0059&grad=%236d1df0"
  width="1200"
  height="500"
  alt="العد التنازلي للاطلاق"
  style="display:block;border:0;outline:0;text-decoration:none;max-width:100%;height:auto;"
/>

Parameters
- deadline: ISO string in UTC (e.g., 2025-02-23T21:00:00Z)
- title: Optional Arabic headline (URL-encode)
- bg: Background start color (hex)
- grad: Background end color (hex)

Notes
- If the deadline has passed, the image shows zeros and the label "تم الإطلاق".
- This design is built for 1200x500. You can scale down in your email client; it will remain crisp.


