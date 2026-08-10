const NOVA_URL = "https://nova-9mjw.onrender.com";

export default {
  async fetch(request) {
    const incomingUrl = new URL(request.url);

    // ---------------------------------------------------------
    // HEALTH CHECK
    // This is called by the front-door browser every 2 seconds.
    // It checks whether Nova/Render is responding.
    // ---------------------------------------------------------
    if (incomingUrl.pathname === "/health") {
      try {
        const response = await fetch(NOVA_URL, {
          method: "GET",
          headers: {
            "User-Agent": "Nova-Front-Door",
            "Cache-Control": "no-cache",
          },
        });

        return new Response(
          JSON.stringify({
            ready: response.ok,
            status: response.status,
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store",
            },
          }
        );
      } catch {
        return new Response(
          JSON.stringify({
            ready: false,
            status: 0,
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store",
            },
          }
        );
      }
    }

    // ---------------------------------------------------------
    // IMMEDIATE NOVA FRONT DOOR
    //
    // IMPORTANT:
    // We do NOT contact Render before returning this page.
    // Therefore this UI can appear immediately.
    // ---------------------------------------------------------
    if (
      incomingUrl.pathname === "/" ||
      incomingUrl.pathname === "/agent"
    ) {
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Nova Skin Care & Hair Center</title>

  <style>
    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      min-height: 100%;
      font-family:
        Inter,
        ui-sans-serif,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
    }

    body {
      background: #f8faf9;
      color: #16352b;
    }

    /* ----------------------------------------
       NOVA GREEN THEME
       ---------------------------------------- */

    :root {
      --nova-green: #087f5b;
      --nova-dark: #056044;
      --nova-light: #35a879;
      --nova-pale: #e8f7f0;
      --nova-text: #16352b;
      --nova-muted: #638077;
    }

    /* ----------------------------------------
       NAVBAR
       ---------------------------------------- */

    .navbar {
      height: 80px;
      background: var(--nova-green);
      color: white;
      display: flex;
      align-items: center;
      box-shadow: 0 4px 18px rgba(0, 80, 55, 0.15);
    }

    .nav-inner {
      width: 100%;
      max-width: 1200px;
      margin: auto;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: white;
      color: var(--nova-green);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 800;
    }

    .brand-name {
      font-size: 20px;
      font-weight: 650;
      letter-spacing: -0.3px;
    }

    .nav-links {
      display: flex;
      gap: 28px;
      align-items: center;
      font-size: 15px;
      font-weight: 600;
    }

    .nav-links span {
      opacity: 0.95;
    }

    .login {
      background: white;
      color: var(--nova-green);
      padding: 10px 17px;
      border-radius: 8px;
      font-weight: 700;
    }

    /* ----------------------------------------
       HERO
       ---------------------------------------- */

    .hero {
      background:
        linear-gradient(
          115deg,
          var(--nova-green),
          var(--nova-light)
        );

      color: white;
      min-height: 430px;

      display: flex;
      align-items: center;
      justify-content: center;

      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: "";
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background: rgba(255,255,255,0.07);
      top: -220px;
      right: -120px;
    }

    .hero::after {
      content: "";
      position: absolute;
      width: 350px;
      height: 350px;
      border-radius: 50%;
      background: rgba(255,255,255,0.05);
      bottom: -200px;
      left: -100px;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      text-align: center;
      max-width: 850px;
      padding: 70px 24px;
    }

    .hero h1 {
      margin: 0 0 18px;
      font-size: clamp(38px, 6vw, 64px);
      line-height: 1.05;
      font-weight: 800;
      letter-spacing: -1.5px;
    }

    .hero p {
      margin: 0 auto 28px;
      max-width: 680px;
      font-size: clamp(18px, 2.5vw, 24px);
      line-height: 1.55;
      color: #e4fff3;
    }

    .hero-buttons {
      display: flex;
      gap: 14px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .button {
      padding: 14px 25px;
      border-radius: 9px;
      font-weight: 700;
      font-size: 16px;
      background: white;
      color: var(--nova-green);
      box-shadow: 0 8px 25px rgba(0,0,0,0.12);
    }

    .button-outline {
      border: 2px solid white;
      color: white;
      padding: 12px 24px;
      border-radius: 9px;
      font-weight: 700;
    }

    /* ----------------------------------------
       WAITING / CONNECTION CARD
       ---------------------------------------- */

    .waiting-card {
      position: absolute;
      z-index: 10;

      left: 50%;
      bottom: 26px;
      transform: translateX(-50%);

      width: min(560px, calc(100% - 32px));

      background: rgba(255,255,255,0.97);
      color: var(--nova-text);

      border-radius: 14px;

      padding: 17px 20px;

      box-shadow:
        0 15px 45px rgba(0, 60, 40, 0.20);

      display: flex;
      align-items: center;
      gap: 15px;

      transition:
        transform 0.3s ease,
        opacity 0.3s ease;
    }

    .status-icon {
      width: 45px;
      height: 45px;
      flex-shrink: 0;

      border-radius: 50%;

      background: var(--nova-pale);

      color: var(--nova-green);

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 21px;
      font-weight: 800;
    }

    .status-content {
      flex: 1;
    }

    .status-title {
      font-weight: 800;
      font-size: 15px;
      margin-bottom: 3px;
    }

    .status-message {
      color: var(--nova-muted);
      font-size: 13px;
      line-height: 1.4;
    }

    .progress {
      margin-top: 9px;
      height: 4px;
      background: #e5eee9;
      border-radius: 20px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      width: 35%;
      background: var(--nova-green);
      border-radius: 20px;
      animation: progress 1.8s ease-in-out infinite;
    }

    @keyframes progress {
      0% {
        transform: translateX(-130%);
      }

      100% {
        transform: translateX(330%);
      }
    }

    /* ----------------------------------------
       FEATURES
       ---------------------------------------- */

    .features {
      background: #f7f9f8;
      padding: 60px 24px;
    }

    .features-inner {
      max-width: 1100px;
      margin: auto;

      display: grid;
      grid-template-columns:
        repeat(3, 1fr);

      gap: 30px;
    }

    .feature {
      text-align: center;
      padding: 22px;
    }

    .feature-icon {
      width: 64px;
      height: 64px;
      margin: auto auto 16px;

      border-radius: 50%;

      background: var(--nova-green);
      color: white;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 25px;

      box-shadow:
        0 8px 20px rgba(8,127,91,0.18);
    }

    .feature h3 {
      margin: 0 0 9px;
      font-size: 19px;
    }

    .feature p {
      margin: 0;
      color: #667a72;
      line-height: 1.6;
      font-size: 14px;
    }

    /* ----------------------------------------
       FOOTER
       ---------------------------------------- */

    .footer {
      background: var(--nova-green);
      color: white;
      padding: 32px 24px;
      text-align: center;
    }

    .footer-brand {
      font-weight: 700;
      font-size: 18px;
    }

    .footer-text {
      color: #ccefe0;
      margin-top: 8px;
      font-size: 13px;
    }

    /* ----------------------------------------
       MOBILE
       ---------------------------------------- */

    @media (max-width: 800px) {

      .nav-links {
        display: none;
      }

      .brand-name {
        font-size: 16px;
      }

      .hero {
        min-height: 520px;
      }

      .hero-content {
        padding-top: 45px;
        padding-bottom: 120px;
      }

      .features-inner {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .waiting-card {
        bottom: 18px;
      }
    }

  </style>
</head>

<body>

  <!-- ==========================================
       NOVA-STYLE FRONT DOOR
       ========================================== -->

  <nav class="navbar">

    <div class="nav-inner">

      <div class="brand">

        <div class="logo">N</div>

        <div class="brand-name">
          Nova Skin Care & Hair Center
        </div>

      </div>

      <div class="nav-links">

        <span>Home</span>
        <span>About</span>
        <span>Services</span>
        <span>Contact</span>

        <span class="login">
          Staff Login
        </span>

      </div>

    </div>

  </nav>


  <!-- ==========================================
       HERO
       ========================================== -->

  <section class="hero">

    <div class="hero-content">

      <h1>
        Premium Skin & Hair Care
      </h1>

      <p>
        Experience luxury treatments with
        scientifically proven results.
      </p>

      <div class="hero-buttons">

        <div class="button">
          Explore Services
        </div>

        <div class="button-outline">
          Book Consultation
        </div>

      </div>

    </div>


    <!-- ========================================
         WAITING CARD
         ======================================== -->

    <div class="waiting-card">

      <div class="status-icon" id="statusIcon">
        ✦
      </div>

      <div class="status-content">

        <div class="status-title" id="statusTitle">
          Preparing your Nova experience
        </div>

        <div class="status-message" id="statusMessage">
          We're getting everything ready for you.
        </div>

        <div class="progress">
          <div class="progress-bar"></div>
        </div>

      </div>

    </div>

  </section>


  <!-- ==========================================
       FEATURES
       ========================================== -->

  <section class="features">

    <div class="features-inner">

      <div class="feature">

        <div class="feature-icon">
          ✦
        </div>

        <h3>
          Expert Treatments
        </h3>

        <p>
          Professional skincare and hair
          treatments tailored to your unique needs.
        </p>

      </div>


      <div class="feature">

        <div class="feature-icon">
          ★
        </div>

        <h3>
          Premium Products
        </h3>

        <p>
          High-quality, scientifically formulated
          products for optimal results.
        </p>

      </div>


      <div class="feature">

        <div class="feature-icon">
          ♡
        </div>

        <h3>
          Certified Specialists
        </h3>

        <p>
          Our team of certified professionals
          ensures the best care for you.
        </p>

      </div>

    </div>

  </section>


  <footer class="footer">

    <div class="footer-brand">
      Nova Skin Care & Hair Center
    </div>

    <div class="footer-text">
      Transforming beauty through advanced
      skincare and hair treatments.
    </div>

  </footer>


  <!-- ==========================================
       RENDER READINESS CHECK
       ========================================== -->

  <script>

    const statusTitle =
      document.getElementById("statusTitle");

    const statusMessage =
      document.getElementById("statusMessage");

    const statusIcon =
      document.getElementById("statusIcon");


    let attempts = 0;


    async function checkNova() {

      attempts++;

      try {

        const response = await fetch(
          "/health?t=" + Date.now(),
          {
            method: "GET",
            cache: "no-store"
          }
        );

        const data = await response.json();


        if (data.ready === true) {

          statusIcon.textContent = "✓";

          statusTitle.textContent =
            "Nova is ready";

          statusMessage.textContent =
            "Everything is ready. Opening your Nova experience...";


          /*
           * Important:
           *
           * We stay on the Cloudflare domain.
           *
           * /nova/ is handled by the Worker proxy.
           */
          setTimeout(() => {

            window.location.href = "/nova/";

          }, 600);


          return;
        }


        // Different messages make the wait feel alive.

        if (attempts === 1) {

          statusTitle.textContent =
            "Welcome to Nova";

          statusMessage.textContent =
            "We're preparing your skincare experience...";

        } else if (attempts === 2) {

          statusTitle.textContent =
            "Preparing your experience";

          statusMessage.textContent =
            "Our clinic is getting everything ready...";

        } else if (attempts === 3) {

          statusTitle.textContent =
            "Almost there";

          statusMessage.textContent =
            "Connecting you to Nova's full experience...";

        } else {

          statusTitle.textContent =
            "Nova is getting ready";

          statusMessage.textContent =
            "Just a moment — your experience is almost ready.";

        }

      } catch {

        statusTitle.textContent =
          "Preparing Nova";

        statusMessage.textContent =
          "Connecting securely to the Nova experience...";

      }


      // Check again in 2 seconds.

      setTimeout(checkNova, 2000);

    }


    /*
     * Start immediately.
     *
     * The front door has already been rendered.
     * Render is contacted only AFTER the UI appears.
     */

    checkNova();

  </script>

</body>
</html>`;


      // -------------------------------------------------------
      // CRITICAL:
      //
      // Return the front door immediately.
      // No fetch(NOVA_URL) happens before this response.
      // -------------------------------------------------------

      return new Response(html, {
        status: 200,

        headers: {
          "Content-Type":
            "text/html; charset=UTF-8",

          "Cache-Control":
            "no-store",

          "X-Nova-Front-Door":
            "active",
        },
      });
    }


    // ---------------------------------------------------------
    // NOVA PROXY
    //
    // Once Nova is awake, requests to /nova/*
    // are forwarded to Render.
    // ---------------------------------------------------------

    if (incomingUrl.pathname.startsWith("/nova")) {

      const novaPath =
        incomingUrl.pathname.replace(/^\/nova/, "") || "/";

      const targetUrl =
        NOVA_URL +
        novaPath +
        incomingUrl.search;

      const proxyRequest =
        new Request(targetUrl, request);

      return fetch(proxyRequest);
    }


    // ---------------------------------------------------------
    // GENERAL PROXY
    //
    // This allows Nova's:
    //
    // /static/...
    // /about/
    // /services/
    // /contact/
    // images
    // CSS
    // JS
    //
    // to continue working through Cloudflare.
    // ---------------------------------------------------------

    const targetUrl =
      NOVA_URL +
      incomingUrl.pathname +
      incomingUrl.search;

    const proxyRequest =
      new Request(targetUrl, request);

    return fetch(proxyRequest);
  },
};