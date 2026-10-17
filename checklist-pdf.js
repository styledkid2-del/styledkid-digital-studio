/* Self-contained, print-ready PDF download for the Kioo Studio starter checklist. */
(function () {
  var button = document.getElementById("download-checklist-pdf");
  if (!button) return;
  var W = 595.28, H = 841.89;
  var GREEN = [0.09, 0.24, 0.19], INK = [0.16, 0.19, 0.17];
  var MUTED = [0.38, 0.42, 0.39], CREAM = [0.97, 0.95, 0.91];
  var GOLD = [0.77, 0.61, 0.37], WHITE = [1, 1, 1];

  function clean(value) {
    return String(value).replace(/[’‘]/g, "'").replace(/[“”]/g, '"')
      .replace(/[–—]/g, "-").replace(/…/g, "...").replace(/[^\x20-\x7E]/g, "");
  }
  function esc(value) {
    return clean(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  }
  function rgb(color) {
    return color.map(function (n) { return Number(n.toFixed(3)); }).join(" ");
  }
  function page() { return { ops: [] }; }
  function rect(p, x, y, w, h, color) {
    p.ops.push(rgb(color) + " rg " + x + " " + (H-y-h) + " " + w + " " + h + " re f");
  }
  function outline(p, x, y, w, h, color, width) {
    p.ops.push(rgb(color) + " RG " + (width || 1) + " w " + x + " " + (H-y-h) + " " + w + " " + h + " re S");
  }
  function line(p, x1, y1, x2, y2, color, width) {
    p.ops.push(rgb(color) + " RG " + (width || 1) + " w " + x1 + " " + (H-y1) + " m " + x2 + " " + (H-y2) + " l S");
  }
  function txt(p, value, x, y, size, font, color) {
    p.ops.push(rgb(color || INK) + " rg BT /" + (font || "F1") + " " + size + " Tf 1 0 0 1 " + x + " " + (H-y) + " Tm (" + esc(value) + ") Tj ET");
  }
  function wrap(value, maxChars) {
    var words = clean(value).split(/\s+/), lines = [], current = "";
    words.forEach(function (word) {
      var next = current ? current + " " + word : word;
      if (next.length > maxChars && current) { lines.push(current); current = word; }
      else current = next;
    });
    if (current) lines.push(current);
    return lines;
  }
  function header(p, pageNo) {
    rect(p, 0, 0, W, 72, GREEN);
    txt(p, "KIOO STUDIO", 42, 31, 12, "F2", WHITE);
    txt(p, "THOUGHTFUL DIGITAL, MADE CLEAR", 42, 49, 7.5, "F1", [0.88, 0.91, 0.87]);
    txt(p, "SMALL-BUSINESS FIELD GUIDE", 390, 31, 7.2, "F2", [0.91, 0.82, 0.66]);
    txt(p, "CHECKLIST  /  0" + pageNo, 390, 47, 7.2, "F1", WHITE);
  }
  function footer(p, pageNo) {
    line(p, 42, 805, W-42, 805, [0.83, 0.82, 0.77], 0.7);
    txt(p, "KIOO STUDIO  |  A PRACTICAL STARTING POINT FOR KENYAN BUSINESSES", 42, 822, 6.8, "F1", MUTED);
    txt(p, pageNo + " / 2", W-64, 822, 7, "F2", GREEN);
  }
  function section(p, y, number, title, items) {
    rect(p, 42, y, 28, 25, GREEN);
    txt(p, number, 49, y+17, 9, "F2", WHITE);
    txt(p, title, 80, y+17, 13, "F2", GREEN);
    var rowY = y+38;
    items.forEach(function (item) {
      outline(p, 82, rowY-9, 10, 10, GOLD, 0.9);
      var lines = wrap(item, 66);
      lines.forEach(function (part, i) { txt(p, part, 102, rowY+i*12, 9, "F1", INK); });
      rowY += Math.max(22, lines.length*12+7);
    });
    line(p, 80, rowY-2, W-42, rowY-2, [0.88, 0.86, 0.81], 0.6);
    return rowY+12;
  }

  button.addEventListener("click", function () {
    var original = button.innerHTML;
    button.disabled = true;
    button.textContent = "Preparing your PDF...";
    try {
      var pages = [];
      var p1 = page();
      header(p1, 1);
      txt(p1, "YOUR ONLINE PRESENCE", 42, 113, 8, "F2", GOLD);
      txt(p1, "Small-business checklist", 42, 151, 26, "F2", GREEN);
      txt(p1, "A clear, practical starting point for your next step.", 42, 174, 10.5, "F1", MUTED);
      rect(p1, 42, 193, W-84, 51, CREAM);
      rect(p1, 42, 193, 3, 51, GOLD);
      txt(p1, "You do not need everything finished before asking for help.", 56, 213, 9.2, "F2", GREEN);
      txt(p1, "Use what you have. Leave the rest for later.", 56, 230, 8.5, "F1", MUTED);
      var y = 265;
      y = section(p1, y, "01", "Your business in one minute", [
        "I can explain what my business does in one or two sentences.",
        "I know who I want to reach or help.",
        "I can describe the main product or service I offer.",
        "I know what makes my offer useful or different."
      ]);
      y = section(p1, y, "02", "The offer", [
        "I have a current list of products or services.",
        "I know the prices or how customers can request a quote.",
        "I can explain how someone buys, books, or gets started.",
        "I know the most important action I want a visitor to take."
      ]);
      section(p1, y, "03", "Brand materials", [
        "I have a logo, if one exists (not essential to start).",
        "I have a few clear, relevant photos or visual references.",
        "I know the colours, style, or feeling I want my business to convey.",
        "I have permission to use the images and logos I share."
      ]);
      footer(p1, 1);
      pages.push(p1);

      var p2 = page();
      header(p2, 2);
      txt(p2, "GET THE ESSENTIALS IN PLACE", 42, 111, 8, "F2", GOLD);
      txt(p2, "Continue your checklist", 42, 143, 22, "F2", GREEN);
      var y2 = 166;
      y2 = section(p2, y2, "04", "Contact and online presence", [
        "My preferred phone number, email, or WhatsApp contact is correct.",
        "I know which contact method I want customers to use.",
        "I have links to any current website or social profiles.",
        "I know the area I serve and whether I work online, in person, or both."
      ]);
      y2 = section(p2, y2, "05", "Goals and practicalities", [
        "I can name the main thing I want to improve.",
        "I have a comfortable starting budget, or I am happy to discuss scope first.",
        "I know what must be included and what can wait.",
        "I have someone available to review content and provide feedback."
      ]);
      rect(p2, 42, y2+1, W-84, 77, CREAM);
      rect(p2, 42, y2+1, 3, 77, GOLD);
      txt(p2, "BEFORE YOU SEND AN ENQUIRY", 56, y2+20, 8, "F2", GREEN);
      wrap("Write a short note with what your business does, what you want to improve, your preferred contact route, and any budget or timing constraints you already know.", 88)
        .slice(0, 3).forEach(function (part, i) { txt(p2, part, 56, y2+38+i*12, 8, "F1", INK); });
      var cy = y2+99;
      txt(p2, "YOU CAN START WITHOUT A PERFECT LOGO, A FINISHED WEBSITE,", 42, cy+2, 8, "F2", GREEN);
      txt(p2, "OR EVERY ANSWER.", 42, cy+15, 8, "F2", GREEN);
      line(p2, 42, cy+29, W-42, cy+29, GOLD, 1);
      txt(p2, "READY WHEN YOU ARE", 42, cy+46, 7.5, "F2", GOLD);
      txt(p2, "Kioo Studio", 42, cy+64, 12, "F2", GREEN);
      txt(p2, "Website: kioo-studio.vercel.app/contact.html", 42, cy+81, 8, "F1", INK);
      txt(p2, "Email: doreennkonge81@gmail.com", 42, cy+96, 8, "F1", INK);
      txt(p2, "WhatsApp: wa.me/254740354169", 42, cy+111, 8, "F1", INK);
      txt(p2, "General preparation guidance only; not a required condition for working together.", 42, cy+132, 7, "F1", MUTED);
      footer(p2, 2);
      pages.push(p2);

      var objects = [], pageIds = [];
      function addObject(value) { objects.push(value); return objects.length; }
      var catalogId = addObject("");
      var pagesId = addObject("");
      var regularId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
      var boldId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
      pages.forEach(function (pg) {
        var stream = pg.ops.join("\n") + "\n";
        var contentId = addObject("<< /Length " + stream.length + " >>\nstream\n" + stream + "endstream");
        var pageId = addObject("<< /Type /Page /Parent " + pagesId + " 0 R /MediaBox [0 0 " + W + " " + H + "] /Resources << /Font << /F1 " + regularId + " 0 R /F2 " + boldId + " 0 R >> >> /Contents " + contentId + " 0 R >>");
        pageIds.push(pageId);
      });
      objects[catalogId-1] = "<< /Type /Catalog /Pages " + pagesId + " 0 R >>";
      objects[pagesId-1] = "<< /Type /Pages /Kids [" + pageIds.map(function (id) { return id + " 0 R"; }).join(" ") + "] /Count " + pageIds.length + " >>";
      var pdf = "%PDF-1.4\n", offsets = [0];
      objects.forEach(function (obj, i) {
        offsets.push(pdf.length);
        pdf += (i+1) + " 0 obj\n" + obj + "\nendobj\n";
      });
      var xrefOffset = pdf.length;
      pdf += "xref\n0 " + (objects.length+1) + "\n0000000000 65535 f \n";
      for (var j=1; j<offsets.length; j++) pdf += String(offsets[j]).padStart(10, "0") + " 00000 n \n";
      pdf += "trailer\n<< /Size " + (objects.length+1) + " /Root " + catalogId + " 0 R >>\nstartxref\n" + xrefOffset + "\n%%EOF";
      var blob = new Blob([pdf], { type: "application/pdf" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "kioo-studio-small-business-checklist.pdf";
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      button.innerHTML = original;
    } catch (error) {
      console.error("Checklist PDF could not be created.", error);
      button.textContent = "Please try the PDF download again";
    } finally {
      button.disabled = false;
    }
  });
})();