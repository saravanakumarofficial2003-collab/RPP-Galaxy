\# API Documentation



\## GET



```

/

```



Dashboard Home



\---



\## POST



```

/telemetry

```



Receives telemetry from PowerShell Agent.



\---



\## WebSocket



```

ws://SERVER-IP:8090

```



Provides live infrastructure updates.



\---



\## Response



```json

{

&#x20;   "hostname":"PC001",

&#x20;   "cpu":20,

&#x20;   "ram":45,

&#x20;   "disk":60

}

```

