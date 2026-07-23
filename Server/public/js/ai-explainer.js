window.openAIForSystem = ip => {
  const s = GALAXY_STATE.systems[ip];

  alert(
    `AI ANALYSIS FOR ${ip}\n\n` +
    `CPU: ${s.CPU}%\n` +
    `RAM: ${s.RAM}%\n` +
    `Disk: ${s.Disk}%\n\n` +
    `WHY:\n- ${s.RiskReasons.join("\n- ")}\n\n` +
    `ACTION:\n- Restart heavy services\n- Add RAM\n- Clear temp files`
  );
};
