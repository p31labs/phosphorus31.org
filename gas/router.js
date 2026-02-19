/**
 * P31 — Router
 * Web app entry. Serves P31 Spectrum.
 */

function doGet() {
  return HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setTitle("P31 — P31 Spectrum")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}