self.addEventListener('message', function(e) {
  const { type, fileData, preset, baseUrl } = e.data;

  if (type !== 'compress') {
    return;
  }

  // Map user presets to PDFSETTINGS values
  let settingsPreset = '/ebook';
  if (preset === 'screen') settingsPreset = '/screen';
  else if (preset === 'ebook') settingsPreset = '/ebook';
  else if (preset === 'printer') settingsPreset = '/printer';
  else if (preset === 'prepress') settingsPreset = '/prepress';

  self.postMessage({ type: 'progress', message: 'Initializing Ghostscript environment...' });

  let success = true;

  // Configure Emscripten Module lifecycle hooks
  self.Module = {
    preRun: [
      function () {
        try {
          self.postMessage({ type: 'progress', message: 'Writing PDF to virtual filesystem...' });
          self.Module.FS.writeFile("input.pdf", new Uint8Array(fileData));
        } catch (err) {
          self.postMessage({ type: 'error', error: 'Failed to write input file to VM filesystem: ' + err.message });
        }
      },
    ],
    postRun: [
      function () {
        try {
          if (success) {
            self.postMessage({ type: 'progress', message: 'Reading compressed document...' });
            
            // Read output file as binary
            var uarray = self.Module.FS.readFile("output.pdf", { encoding: "binary" });
            
            // Transfer ArrayBuffer back to main thread (avoid cloning overhead)
            const buffer = uarray.buffer;
            self.postMessage({ type: 'done', data: buffer }, [buffer]);
          } else {
            self.postMessage({ type: 'error', error: 'Ghostscript failed to run (non-zero status code).' });
          }
        } catch (err) {
          console.error(err);
          self.postMessage({ type: 'error', error: 'Failed to read output file from VM filesystem: ' + (err.message || err) });
        } finally {
          // Clean up virtual filesystem files to free up memory immediately under all conditions
          try {
            self.Module.FS.unlink("input.pdf");
          } catch {}
          try {
            self.Module.FS.unlink("output.pdf");
          } catch {}
        }
      },
    ],
    locateFile: function (path, prefix) {
      if (path.endsWith(".wasm")) {
        return `${baseUrl}/wasm/${path}`;
      }
      return prefix + path;
    },
    arguments: [
      "-sDEVICE=pdfwrite",
      "-dCompatibilityLevel=1.4",
      `-dPDFSETTINGS=${settingsPreset}`,
      "-dNOPAUSE",
      "-dQUIET",
      "-dBATCH",
      "-sOutputFile=output.pdf",
      "input.pdf",
    ],
    onAbort: function (err) {
      self.postMessage({ type: 'error', error: 'Ghostscript engine aborted: ' + String(err) });
    },
    quit: function (status, err) {
      if (status === 0) {
        success = true;
      } else {
        success = false;
        console.error('Ghostscript quit status:', status, err);
      }
    },
    print: function (text) {
      console.log(text);
    },
    printErr: function (text) {
      console.error(text);
    },
    totalDependencies: 0,
    noExitRuntime: 1
  };

  try {
    self.postMessage({ type: 'progress', message: 'Loading compression engine...' });
    if (!self.Module.callMain) {
      // Load the primary Ghostscript JS glue file inside worker context
      self.importScripts(`${baseUrl}/wasm/gs-worker.js`);
    } else {
      // Re-run callMain on the same engine if already loaded
      self.Module.calledRun = false;
      self.Module.callMain();
    }
  } catch (err) {
    self.postMessage({ type: 'error', error: 'Failed to launch Ghostscript compiler: ' + err.message });
  }
});
