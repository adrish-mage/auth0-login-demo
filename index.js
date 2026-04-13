const express = require('express')
const { auth, requiresAuth } = require('express-openid-connect')
require('dotenv').config()

const app = express()

app.use(auth({
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
}))

app.get('/', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.redirect('/profile')
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Dev Card</title>
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family: sans-serif; background: #09090b;
                 color: white; height: 100vh;
                 display: flex; align-items: center;
                 justify-content: center; flex-direction: column; gap: 16px; }
          h1 { font-size: 28px; }
          p { color: #888; font-size: 14px; }
          a { padding: 12px 28px; background: #3b82f6;
              color: white; border-radius: 8px;
              text-decoration: none; font-size: 14px; }
        </style>
      </head>
      <body>
        <h1>Dev Card Generator</h1>
        <p>Log in to generate your developer card</p>
        <a href="/login">Login with Google</a>
      </body>
      </html>
    `)
  }
})

app.get('/profile', requiresAuth(), (req, res) => {
  const user = req.oidc.user
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Dev Card · ${user.name}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: sans-serif; background: #09090b;
               color: white; min-height: 100vh;
               display: flex; align-items: center;
               justify-content: center; padding: 2rem; }
        .card {
          background: #18181b;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 32px;
          width: 100%;
          max-width: 380px;
          text-align: center;
        }
        .card img {
          width: 80px; height: 80px;
          border-radius: 50%;
          border: 2px solid #3b82f6;
          margin-bottom: 16px;
        }
        .card h2 { font-size: 22px; margin-bottom: 4px; }
        .card p { color: #888; font-size: 13px; margin-bottom: 20px; }
        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }
        .stat {
          background: #27272a;
          border-radius: 8px;
          padding: 10px;
        }
        .stat-num { font-size: 20px; font-weight: 700; color: #3b82f6; }
        .stat-lbl { font-size: 10px; color: #666; margin-top: 2px; }
        .tag {
          display: inline-block;
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.2);
          color: #3b82f6;
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 99px;
          margin: 2px;
        }
        .logout {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 24px;
          background: #ef4444;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <img src="${user.picture}" alt="avatar" />
        <h2>${user.name}</h2>
        <p>${user.email}</p>
        <div class="stats">
          <div class="stat">
            <div class="stat-num">C++</div>
            <div class="stat-lbl">Primary</div>
          </div>
          <div class="stat">
            <div class="stat-num">JS</div>
            <div class="stat-lbl">Web</div>
          </div>
          <div class="stat">
            <div class="stat-num">1st</div>
            <div class="stat-lbl">Year</div>
          </div>
        </div>
        <span class="tag">DSA</span>
        <span class="tag">Node.js</span>
        <span class="tag">Auth0</span>
        <span class="tag">GSoC 2027</span>
        <br/>
        <a href="/logout" class="logout">Logout</a>
      </div>
    </body>
    </html>
  `)
})

app.listen(3000, () => console.log('Running on http://localhost:3000'))