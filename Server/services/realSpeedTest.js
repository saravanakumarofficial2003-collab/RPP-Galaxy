import speedTest from "speedtest-net";

export async function getRealInternetSpeed() {

  try {

    const result = await speedTest({
      acceptLicense: true,
      acceptGdpr: true
    });

    return {
      download: result.download.bandwidth * 8 / 1e6, // Mbps
      upload: result.upload.bandwidth * 8 / 1e6,
      ping: result.ping.latency
    };

  } catch (err) {

    console.log("Speed test error:", err.message);

    return {
      download: 0,
      upload: 0,
      ping: 0
    };
  }
}
