document.addEventListener("DOMContentLoaded", function () {
  fetch("/apps/cart-drawer-settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("cart-drawer-settings:", data);

      // data from your action is an array of products
      const firstProduct = Array.isArray(data) ? data[0] : null;
      const conf = firstProduct?.countdownTimerConfig;

      if (!conf || !conf.isCountdown) {
        return; // nothing to do if countdown disabled
      }

      const visibility = conf.visibility; // "showEndsAtMidnight" | "showCustomEndDate" | default
      const duration = Number(conf.fixedDurationTime || 0); // minutes
      const endDateTime = conf.endDateTime || ""; // e.g. "2025-12-31T23:59:59Z"
      const msgText = conf.msgText || "";

      const container = document.querySelector(".countdown-timer-container");
      if (!container) return;

      const textEl = container.querySelector(".countdown-text");
      if (!textEl) return;

      // use msgText from config, with {{timer}} placeholder
      // if you already render msgText server-side, you can skip this
      textEl.innerHTML = msgText;
      const originalText =
        textEl.getAttribute("data-template") || textEl.innerHTML;

      // ----- helpers -----
      function getSecondsUntilMidnight() {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        return Math.max(0, Math.floor((midnight - now) / 1000));
      }

      function getSecondsUntilCustom(dateTimeStr) {
        if (!dateTimeStr) return 0;

        // supports "YYYY-MM-DDTHH:MM:SSZ" or "YYYY-MM-DDTHH:MM"
        const [datePart, timePartRaw] = dateTimeStr.split("T");
        if (!datePart || !timePartRaw) return 0;

        const [y, m, d] = datePart.split("-").map(Number);

        const timePart = timePartRaw.replace("Z", "");
        const [h, min = "0", s = "0"] = timePart.split(":");
        const hours = Number(h);
        const minutes = Number(min);
        const seconds = Number(s);

        const target = new Date(y, m - 1, d, hours, minutes, seconds);
        const now = new Date();

        return Math.max(0, Math.floor((target - now) / 1000));
      }

      function getInitialSeconds() {
        if (visibility === "showEndsAtMidnight") {
          return getSecondsUntilMidnight();
        }

        if (visibility === "showCustomEndDate") {
          return getSecondsUntilCustom(endDateTime);
        }

        // default: fixed duration in minutes
        return duration * 60;
      }

      let timeLeft = getInitialSeconds();

      function formatTime(seconds) {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (days > 0) {
          return (
            days +
            ":" +
            String(hours).padStart(2, "0") +
            ":" +
            String(minutes).padStart(2, "0") +
            ":" +
            String(secs).padStart(2, "0")
          );
        }

        if (hours > 0) {
          return (
            String(hours).padStart(2, "0") +
            ":" +
            String(minutes).padStart(2, "0") +
            ":" +
            String(secs).padStart(2, "0")
          );
        }

        return (
          String(minutes).padStart(2, "0") +
          ":" +
          String(secs).padStart(2, "0")
        );
      }

      function updateTimer() {
        const formatted = formatTime(timeLeft);

        // always replace on the ORIGINAL template with {{timer}}
        textEl.innerHTML = originalText.replace(
          /{{\s*timer\s*}}/g,
          formatted,
        );

        if (timeLeft <= 0) {
          return;
        }

        timeLeft -= 1;
      }

      // if no time left, just render once and stop
      if (timeLeft <= 0) {
        textEl.innerHTML = originalText.replace(/{{\s*timer\s*}}/g, "00:00");
        return;
      }

      updateTimer();
      const intervalId = setInterval(() => {
        if (timeLeft <= 0) {
          clearInterval(intervalId);
          return;
        }
        updateTimer();
      }, 1000);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
});
