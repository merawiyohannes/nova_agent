const NOVA_URL = "https://nova-9mjw.onrender.com";

const READY_COOKIE = "NOVA_READY=1; Max-Age=600; Path=/; Secure; SameSite=Lax";

export default {
  async fetch(request) {
    const incomingUrl = new URL(request.url);

    // ---------------------------------------------------------
    // READ NOVA_READY COOKIE
    // ---------------------------------------------------------

    const cookieHeader = request.headers.get("Cookie") || "";
    const novaReady = cookieHeader
      .split(";")
      .some(cookie => cookie.trim() === "NOVA_READY=1");


    // ---------------------------------------------------------
    // HEALTH CHECK
    //
    // The front-door browser calls this while Render is waking.
    // ---------------------------------------------------------

    if (incomingUrl.pathname === "/health") {
      try {
        const response = await fetch(NOVA_URL, {
          method: "GET",

          headers: {
            "User-Agent": "Nova-Cloudflare-Front-Door",
            "Cache-Control": "no-cache",
          },

          redirect: "follow",
        });

        if (response.ok) {
          return new Response(
            JSON.stringify({
              ready: true,
              status: response.status,
            }),
            {
              status: 200,

              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",

                // Nova is awake.
                // Remember that for the next 10 minutes.
                "Set-Cookie": READY_COOKIE,
              },
            }
          );
        }

        return new Response(
          JSON.stringify({
            ready: false,
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
    // ROOT "/"
    //
    // If Nova is already known to be awake:
    //     proxy directly to Nova.
    //
    // If not:
    //     immediately show the Nova front door.
    // ---------------------------------------------------------

    if (incomingUrl.pathname === "/") {

      if (novaReady) {
        return proxyToNova(request, incomingUrl);
      }

      // -------------------------------------------------------
      // IMPORTANT:
      //
      // We DO NOT contact Render here.
      //
      // This HTML is returned immediately.
      // -------------------------------------------------------

      const html = `<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Nova Skin Care & Hair Center</title>


  <style>

    * {
      box-sizing: border-box;
    }


    :root {

      --nova-green: #087f5b;
      --nova-dark: #056044;
      --nova-light: #35a879;

      --nova-pale: #e8f7f0;

      --text: #17382e;
      --muted: #688078;

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

      color: var(--text);

    }


    body {
      background: #f7faf8;
    }


    /* ========================================================
       NAVBAR
       ======================================================== */

    .navbar {

      height: 80px;

      background: var(--nova-green);

      color: white;

      display: flex;

      align-items: center;

      box-shadow:
        0 4px 18px rgba(0, 80, 55, 0.15);

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

      align-items: center;

      gap: 27px;

      font-size: 15px;

      font-weight: 600;

    }


    .nav-link {
      opacity: 0.95;
    }


    .login {

      background: white;

      color: var(--nova-green);

      padding: 10px 17px;

      border-radius: 8px;

      font-weight: 700;

    }


    /* ========================================================
       HERO
       ======================================================== */

    .hero {

      min-height: 450px;

      position: relative;

      overflow: hidden;

      display: flex;

      align-items: center;

      justify-content: center;

      background:
        linear-gradient(
          115deg,
          var(--nova-green),
          var(--nova-light)
        );

      color: white;

    }


    .hero::before {

      content: "";

      position: absolute;

      width: 520px;
      height: 520px;

      border-radius: 50%;

      background:
        rgba(255,255,255,0.07);

      top: -250px;
      right: -120px;

    }


    .hero::after {

      content: "";

      position: absolute;

      width: 380px;
      height: 380px;

      border-radius: 50%;

      background:
        rgba(255,255,255,0.05);

      bottom: -230px;
      left: -120px;

    }


    .hero-content {

      position: relative;

      z-index: 2;

      text-align: center;

      max-width: 850px;

      padding:
        70px 24px 145px;

    }


    .hero h1 {

      margin: 0 0 18px;

      font-size:
        clamp(38px, 6vw, 64px);

      line-height: 1.05;

      font-weight: 800;

      letter-spacing: -1.5px;

    }


    .hero p {

      margin: 0 auto 30px;

      max-width: 680px;

      font-size:
        clamp(18px, 2.5vw, 24px);

      line-height: 1.55;

      color: #e4fff3;

    }


    .buttons {

      display: flex;

      justify-content: center;

      gap: 14px;

      flex-wrap: wrap;

    }


    .button {

      padding: 14px 25px;

      border-radius: 9px;

      background: white;

      color: var(--nova-green);

      font-weight: 700;

      box-shadow:
        0 8px 25px rgba(0,0,0,0.12);

    }


    .button-outline {

      padding: 12px 24px;

      border:
        2px solid white;

      border-radius: 9px;

      color: white;

      font-weight: 700;

    }


    /* ========================================================
       SMART WAITING CARD
       ======================================================== */

    .waiting-card {

      position: absolute;

      z-index: 20;

      left: 50%;
      bottom: 25px;

      transform: translateX(-50%);

      width:
        min(600px, calc(100% - 32px));

      background:
        rgba(255,255,255,0.98);

      color: var(--text);

      border-radius: 15px;

      padding: 18px 20px;

      display: flex;

      align-items: center;

      gap: 15px;

      box-shadow:
        0 18px 50px
        rgba(0, 60, 40, 0.22);

    }


    .status-icon {

      width: 46px;
      height: 46px;

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

      font-size: 15px;

      font-weight: 800;

      margin-bottom: 4px;

    }


    .status-message {

      font-size: 13px;

      line-height: 1.45;

      color: var(--muted);

    }


    .progress {

      height: 4px;

      margin-top: 10px;

      overflow: hidden;

      border-radius: 20px;

      background: #e5eee9;

    }


    .progress-bar {

      height: 100%;

      width: 30%;

      border-radius: 20px;

      background: var(--nova-green);

      animation:
        progress 1.7s
        ease-in-out
        infinite;

    }


    @keyframes progress {

      0% {
        transform: translateX(-150%);
      }

      100% {
        transform: translateX(400%);
      }

    }


    /* ========================================================
       FEATURES
       ======================================================== */

    .features {

      padding: 60px 24px;

      background: #f7f9f8;

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

      padding: 20px;

    }


    .feature-icon {

      width: 64px;
      height: 64px;

      margin:
        auto auto 16px;

      border-radius: 50%;

      background: var(--nova-green);

      color: white;

      display: flex;

      align-items: center;
      justify-content: center;

      font-size: 25px;

      box-shadow:
        0 8px 20px
        rgba(8,127,91,0.18);

    }


    .feature h3 {

      margin:
        0 0 9px;

      font-size: 19px;

    }


    .feature p {

      margin: 0;

      color: #667a72;

      line-height: 1.6;

      font-size: 14px;

    }


    /* ========================================================
       FOOTER
       ======================================================== */

    .footer {

      background:
        var(--nova-green);

      color: white;

      text-align: center;

      padding: 32px 24px;

    }


    .footer-brand {

      font-size: 18px;

      font-weight: 700;

    }


    .footer-text {

      margin-top: 8px;

      color: #ccefe0;

      font-size: 13px;

    }


    /* ========================================================
       MOBILE
       ======================================================== */

    @media (max-width: 800px) {

      .nav-links {
        display: none;
      }

      .brand-name {
        font-size: 16px;
      }

      .hero {
        min-height: 540px;
      }

      .features-inner {
        grid-template-columns: 1fr;
      }

    }

  </style>

</head>


<body>


  <!-- ======================================================
       NOVA NAVBAR
       ====================================================== -->

  <nav class="navbar">

    <div class="nav-inner">

      <div class="brand">

        <div class="logo">
          N
        </div>

        <div class="brand-name">
          Nova Skin Care & Hair Center
        </div>

      </div>


      <div class="nav-links">

        <span class="nav-link">
          Home
        </span>

        <span class="nav-link">
          About
        </span>

        <span class="nav-link">
          Services
        </span>

        <span class="nav-link">
          Contact
        </span>

        <span class="login">
          Staff Login
        </span>

      </div>

    </div>

  </nav>


  <!-- ======================================================
       NOVA HERO
       ====================================================== -->

  <section class="hero">

    <div class="hero-content">

      <h1>
        Premium Skin & Hair Care
      </h1>


      <p>
        Experience luxury treatments with
        scientifically proven results
      </p>


      <div class="buttons">

        <div class="button">
          Explore Services
        </div>

        <div class="button-outline">
          Book Consultation
        </div>

      </div>

    </div>


    <!-- ====================================================
         WAITING EXPERIENCE
         ==================================================== -->

    <div class="waiting-card">

      <div
        class="status-icon"
        id="statusIcon"
      >
        ✦
      </div>


      <div class="status-content">

        <div
          class="status-title"
          id="statusTitle"
        >
          Welcome to Nova
        </div>


        <div
          class="status-message"
          id="statusMessage"
        >
          We're preparing your skincare experience.
        </div>


        <div class="progress">

          <div class="progress-bar"></div>

        </div>

      </div>

    </div>

  </section>


  <!-- ======================================================
       FEATURES
       ====================================================== -->

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


  <!-- ======================================================
       FOOTER
       ====================================================== -->

  <footer class="footer">

    <div class="footer-brand">
      Nova Skin Care & Hair Center
    </div>

    <div class="footer-text">
      Transforming beauty through advanced
      skincare and hair treatments.
    </div>

  </footer>


  <!-- ======================================================
       BACKGROUND NOVA READINESS CHECK
       ====================================================== -->

  <script>

    const title =
      document.getElementById("statusTitle");

    const message =
      document.getElementById("statusMessage");

    const icon =
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


        const data =
          await response.json();


        if (data.ready === true) {

          icon.textContent = "✓";


          title.textContent =
            "Nova is ready";


          message.textContent =
            "Everything is ready. Opening your Nova experience...";


          /*
           * / is intentional.
           *
           * The Worker has now stored NOVA_READY=1.
           * The next request to / will therefore proxy
           * directly to the real Nova homepage.
           */

          setTimeout(() => {

            window.location.replace("/");

          }, 600);


          return;

        }


        /*
         * Make the waiting experience feel like
         * the business is actually preparing.
         */

        if (attempts === 1) {

          title.textContent =
            "Welcome to Nova";

          message.textContent =
            "Preparing your premium skincare experience...";

        }

        else if (attempts === 2) {

          title.textContent =
            "Preparing your experience";

          message.textContent =
            "We're getting Nova's services ready for you...";

        }

        else if (attempts === 3) {

          title.textContent =
            "Almost there";

          message.textContent =
            "Connecting you with Nova's full experience...";

        }

        else {

          title.textContent =
            "Nova is getting ready";

          message.textContent =
            "Just a moment — your experience is almost ready.";

        }


      } catch {

        title.textContent =
          "Preparing Nova";


        message.textContent =
          "Connecting securely to the Nova experience...";

      }


      /*
       * Check again after 2 seconds.
       */

      setTimeout(checkNova, 2000);

    }


    /*
     * IMPORTANT:
     *
     * The front door is already visible.
     *
     * Only now do we begin contacting Render.
     */

    checkNova();

  </script>


</body>

</html>`;


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
    // EVERYTHING ELSE
    //
    // /about/
    // /services/
    // /contact/
    // /login/
    // /dashboard/
    // /static/
    // images
    // JS
    // CSS
    //
    // all go directly through the proxy.
    // ---------------------------------------------------------

    return proxyToNova(request, incomingUrl);
  },
};


// =============================================================
// NOVA PROXY FUNCTION
// =============================================================

async function proxyToNova(request, incomingUrl) {

  const targetUrl =
    NOVA_URL +
    incomingUrl.pathname +
    incomingUrl.search;


  const proxyRequest =
    new Request(targetUrl, request);


  const response =
    await fetch(proxyRequest);


  /*
   * Copy the upstream response headers.
   *
   * This allows Django's cookies, content types,
   * redirects, etc. to travel back to the browser.
   */

  const headers =
    new Headers(response.headers);


  /*
   * Keep the browser on the Cloudflare front door
   * when possible.
   *
   * If Django returns a redirect to the Render URL,
   * rewrite it back to the Cloudflare URL.
   */

  const location =
    headers.get("Location");


  if (location) {

    try {

      const locationUrl =
        new URL(location);


      if (
        locationUrl.hostname ===
        "nova-9mjw.onrender.com"
      ) {

        const publicUrl =
          new URL(
            locationUrl.pathname +
            locationUrl.search,
            incomingUrl.origin
          );


        headers.set(
          "Location",
          publicUrl.toString()
        );

      }

    } catch {
      // Leave unusual Location headers untouched.
    }
  }


  return new Response(
    response.body,
    {
      status: response.status,
      statusText: response.statusText,
      headers,
    }
  );
}