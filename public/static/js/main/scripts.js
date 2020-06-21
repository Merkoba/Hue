// Loads a Javascript file from a specified URL
// Resolves a promise when the <script> is loaded
Hue.load_script = function (source) {
  if (!Hue.load_scripts) {
    return false;
  }

  console.info(`Loading script: ${source}`);

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    document.body.appendChild(script);
    script.onload = resolve;
    script.onerror = reject;
    script.async = true;
    script.src = source;
  });
};

// Loads the Wordz library
// Returns a promise
Hue.load_wordz = async function () {
  if (Hue.wordz_loading) {
    return false;
  }

  Hue.wordz_loading = true;

  return new Promise(async (resolve, reject) => {
    await Hue.load_script("/static/js/libs2/wordz.js?version=1");
    Hue.wordz = Wordz();
    resolve();
  });
};
