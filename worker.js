const NOVA_URL = "https://nova-9mjw.onrender.com";

export default {
  async fetch(request) {
    const incomingUrl = new URL(request.url);

    // ---------------------------------------------------------
    // 1. Health/readiness check
    // Browser calls /health repeatedly while Nova is waking.
    // ---------------------------------------------------------
    if (incomingUrl.pathname === "/health") {
      try {
        const response = await fetch(NOVA_URL, {
          method: "GET",
          headers: {
            "User-Agent": "Nova-Cloudflare-Agent",
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
      } catch (error) {
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
    // 2. Front-door loading screen
    // ---------------------------------------------------------
    if (incomingUrl.pathname === "/" || incomingUrl.pathname === "/agent") {
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Nova</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
      background: #f7f7f7;
      color: #222;
    }

    .container {
      text-align: center;
      padding: 40px 25px;
      max-width: 500px;
      width: 90%;
    }

    .logo {
      font-size: 42px;
      font-weight: 700;
      margin-bottom: 25px;
    }

    .spinner {
      width: 48px;
      height: 48px;
      margin: 0 auto 25px;
      border: 4px solid #ddd;
      border-top-color: #222;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    h1 {
      font-size: 24px;
      margin: 0 0 10px;
    }

    p {
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    .status {
      margin-top: 18px;
      font-size: 14px;
      color: #888;
    }
  </style>
</head>

<body>

  <div class="container">

    <div class="logo">Nova</div>

    <div class="spinner"></div>

    <h1>Starting Nova...</h1>

    <p>
      Nova is waking up. Please wait a moment.
    </p>

    <div class="status" id="status">
      Connecting to Nova...
    </div>

  </div>

<script>

  const statusElement = document.getElementById("status");

  let attempts = 0;

  async function checkNova() {

    attempts++;

    try {

      statusElement.textContent =
        "Checking Nova... attempt " + attempts;

      const response = await fetch("/health", {
        cache: "no-store"
      });

      const data = await response.json();

      if (data.ready === true) {

        statusElement.textContent =
          "Nova is ready. Opening...";

        // Give the browser a tiny moment to show
        // the ready message before redirecting.
        setTimeout(() => {

          window.location.href = "/nova/";

        }, 500);

        return;
      }

      statusElement.textContent =
        "Nova is still waking up...";

    } catch (error) {

      statusElement.textContent =
        "Waiting for Nova...";

    }

    // Check again after 3 seconds.
    setTimeout(checkNova, 3000);
  }

  checkNova();

</script>

</body>
</html>`;

      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=UTF-8",
          "Cache-Control": "no-store",
        },
      });
    }

    // ---------------------------------------------------------
    // 3. Proxy everything under /nova/ to Render
    // ---------------------------------------------------------
    if (incomingUrl.pathname.startsWith("/nova")) {

      const novaPath =
        incomingUrl.pathname.replace(/^\\/nova/, "") || "/";

      const targetUrl =
        NOVA_URL + novaPath + incomingUrl.search;

      const proxyRequest = new Request(targetUrl, request);

      return fetch(proxyRequest);
    }

    // ---------------------------------------------------------
    // 4. Anything else → send to Nova
    // ---------------------------------------------------------
    const targetUrl =
      NOVA_URL + incomingUrl.pathname + incomingUrl.search;

    const proxyRequest = new Request(targetUrl, request);

    return fetch(proxyRequest);
  },
};