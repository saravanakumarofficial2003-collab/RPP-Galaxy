Set objShell = CreateObject("Wscript.Shell")
objShell.Run "powershell -ExecutionPolicy Bypass -File C:\RPP_GALAXY\SecurityAgent\SecurityAgent.ps1", 0, False
