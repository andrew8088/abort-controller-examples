// Example 1 ---------------------------------------------------------------------
export async function main() {
  const controller = new AbortController();

  console.log("starting download");
  const videoP = downloadVideo(controller);
  console.log("starting abort timer");

  const id = setTimeout(() => {
    console.log("aborting");
    controller.abort();
  }, 500);

  try {
    console.log("awaiting promise");
    const res = await videoP;
    clearTimeout(id);
    console.log(await res.text());
  } catch (err) {
    console.log("response error");
    console.error(err);
  }
}

function downloadVideo(controller: AbortController) {
  return fetch("http://localhost:3000", {
    signal: controller.signal,
  });
}

// main().catch(console.log);

// Example 2 ---------------------------------------------------------------------
export async function timeout<T>(
  ms: number,
  cb: (contorller: AbortController) => Promise<T>
): Promise<T> {
  const controller = new AbortController();
  const p = cb(controller);

  const id = setTimeout(() => {
    controller.abort();
  }, ms);

  try {
    return await p;
  } finally {
    console.log("clearing");
    clearTimeout(id);
  }
}

// timeout(1500, downloadVideo)
//   .then((r) => r.text())
//   .then(console.log);

// Example 3 ---------------------------------------------------------------------
type FetchParams = Parameters<typeof fetch>;

export function fetchWithTimeout(
  url: FetchParams[0],
  options: FetchParams[1] & { timeout: number }
) {
  const { timeout, ...fetchOptions } = options;

  return fetch(url, {
    signal: AbortSignal.timeout(timeout),
    ...fetchOptions,
  });
}

fetchWithTimeout("http://localhost:3000", { timeout: 500 })
  .then((r) => r.text())
  .then(console.log);
