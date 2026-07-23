// =====================================================
// GALAXY VOICE ENGINE – STABLE
// =====================================================

(function () {
  if (window.GALAXY_VOICE) return;

  let enabled = false;

  function unlock() {
    enabled = true;
    console.log("🔊 Voice unlocked");
  }

  document.addEventListener("click", unlock, { once: true });

  window.GALAXY_VOICE = {
    speak(text) {
      if (!enabled) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-IN";
      u.rate = 0.95;
      u.pitch = 1.05;
      speechSynthesis.speak(u);
    }
  };

  window.GalaxyPlayVoice = text => {
    if (window.GALAXY_VOICE) GALAXY_VOICE.speak(text);
  };
})();
