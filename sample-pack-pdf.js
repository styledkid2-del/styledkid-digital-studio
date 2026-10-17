/* A self-contained, branded PDF preview of the illustrative Kioo Studio sample work. */
(function () {
  var button = document.getElementById("download-sample-pack-pdf");
  if (!button) return;
  var W = 595.28, H = 841.89;
  var GREEN = [0.09, 0.24, 0.19], INK = [0.13, 0.16, 0.14];
  var MUTED = [0.35, 0.39, 0.36], CREAM = [0.97, 0.95, 0.91];
  var GOLD = [0.75, 0.43, 0.29], SAGE = [0.88, 0.91, 0.84], WHITE = [1, 1, 1];
  function clean(v) { return String(v).replace(/[’‘]/g,"'").replace(/[“”]/g,'"').replace(/[–—]/g,"-").replace(/…/g,"...").replace(/[^\x20-\x7E]/g,""); }
  function esc(v) { return clean(v).replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)"); }
  function rgb(c) { return c.map(function(n){return Number(n.toFixed(3));}).join(" "); }
  function page(){return {ops:[]};}
  function rect(p,x,y,w,h,c){p.ops.push(rgb(c)+" rg "+x+" "+(H-y-h)+" "+w+" "+h+" re f");}
  function line(p,x1,y1,x2,y2,c,w){p.ops.push(rgb(c)+" RG "+(w||1)+" w "+x1+" "+(H-y1)+" m "+x2+" "+(H-y2)+" l S");}
  function txt(p,v,x,y,s,f,c){p.ops.push(rgb(c||INK)+" rg BT /"+(f||"F1")+" "+s+" Tf 1 0 0 1 "+x+" "+(H-y)+" Tm ("+esc(v)+") Tj ET");}
  function wrap(v,n){var words=clean(v).split(/\s+/),out=[],cur="";words.forEach(function(w){var next=cur?cur+" "+w:w;if(next.length>n&&cur){out.push(cur);cur=w;}else cur=next;});if(cur)out.push(cur);return out;}
  function paragraph(p,v,x,y,maxChars,size,leading,c,font){wrap(v,maxChars).forEach(function(t,i){txt(p,t,x,y+i*leading,size,font||"F1",c||INK);});}
  function header(p,n,label){rect(p,0,0,W,84,GREEN);txt(p,"KIOO STUDIO",40,31,12,"F2",WHITE);txt(p,"THOUGHTFUL DIGITAL, MADE CLEAR",40,49,7.5,"F1",[0.87,0.91,0.85]);txt(p,label.toUpperCase(),40,69,7,"F2",[0.91,0.79,0.62]);txt(p,"SAMPLE PACK  /  0"+n,440,31,7,"F2",WHITE);}
  function footer(p,n){line(p,40,805,W-40,805,[0.83,0.82,0.77],.7);txt(p,"ILLUSTRATIVE EXAMPLES ONLY - NOT CLIENT WORK",40,822,6.8,"F1",MUTED);txt(p,n+" / 2",W-65,822,7,"F2",GREEN);}
  function tag(p,v,x,y,w){rect(p,x,y,w,19,SAGE);txt(p,v,x+8,y+12,7,"F2",GREEN);}
  button.addEventListener("click",function(){
    var original=button.innerHTML;button.disabled=true;button.textContent="Preparing your PDF...";
    try{
      var p1=page();header(p1,1,"Illustrative creative directions");
      txt(p1,"A MINI CREATIVE",40,129,8,"F2",GOLD);txt(p1,"Sample pack",40,164,29,"F2",GREEN);
      paragraph(p1,"A short preview of how a small business might introduce itself, plan useful content and guide a visitor towards a clear next step.",40,188,83,9,14,MUTED);
      rect(p1,40,229,W-80,25,CREAM);txt(p1,"FICTIONAL EXAMPLE BRAND: MWANGAZA PANTRY",52,245,8,"F2",GREEN);
      tag(p1,"01  /  BRAND BIO",40,274,124);
      txt(p1,"Made with care. Rooted in home.",40,319,20,"F2",GREEN);
      paragraph(p1,"At Mwangaza Pantry, we make everyday Kenyan pantry staples feel thoughtful, fresh and easy to bring to the family table. Discover familiar favourites, carefully packed and ready for your next meal.",40,345,79,9,15,INK);
      line(p1,40,411,W-40,411,GOLD,1);
      tag(p1,"02  /  THREE CONTENT PROMPTS",40,433,178);
      var items=[
        ["MONDAY  /  MEET THE MAKER","Introduce the person, purpose or small moment behind the business."],
        ["WEDNESDAY  /  SHOW HOW IT HELPS","Share a product demonstration, practical tip or answer to a common question."],
        ["FRIDAY  /  INVITE A CONVERSATION","Address a customer question and give one clear next step."]
      ];
      items.forEach(function(it,i){var y=476+i*76;txt(p1,it[0],40,y,8,"F2",GOLD);paragraph(p1,it[1],40,y+19,82,8.5,13,INK);if(i<2)line(p1,40,y+53,W-40,y+53,[0.86,0.84,0.79],.6);});
      rect(p1,40,710,W-80,58,CREAM);txt(p1,"KEEP IT USEFUL",52,730,8,"F2",GREEN);paragraph(p1,"Each post should help someone understand, trust or take the next step with the business.",52,748,80,8,12,MUTED);
      footer(p1,1);

      var p2=page();header(p2,2,"From idea to clear next step");
      txt(p2,"03  /  LANDING-PAGE OUTLINE",40,120,8,"F2",GOLD);txt(p2,"A simple page, with a purpose.",40,151,20,"F2",GREEN);
      var blocks=[
        ["01  INTRODUCE","A clear headline that says what the business offers and who it helps."],
        ["02  SHOW THE OFFER","A short description, useful details and real product or service photos."],
        ["03  BUILD CONFIDENCE","Answers to common questions, service area and honest supporting details."],
        ["04  MAKE THE NEXT STEP EASY","One primary action, such as WhatsApp, enquiry form or product catalogue."]
      ];
      blocks.forEach(function(it,i){var y=175+i*66;rect(p2,40,y,W-80,53,i%2?CREAM:SAGE);txt(p2,it[0],52,y+18,7.5,"F2",GREEN);paragraph(p2,it[1],52,y+36,78,8,11,INK);});
      line(p2,40,455,W-40,455,GOLD,1);
      txt(p2,"04  /  A QUICK BRIEF WORKSHEET",40,480,8,"F2",GOLD);txt(p2,"Bring these answers if you have them.",40,505,16,"F2",GREEN);
      var qs=["Business name and what you offer","Who you most want to reach","The main result you want from this project","Useful links, photos or brand references","Preferred contact method and any budget range"];
      qs.forEach(function(q,i){var y=535+i*31;rect(p2,42,y-9,10,10,WHITE);line(p2,42,y-9,52,y-9,GOLD,.8);line(p2,42,y+1,52,y+1,GOLD,.8);line(p2,42,y-9,42,y+1,GOLD,.8);line(p2,52,y-9,52,y+1,GOLD,.8);txt(p2,q,62,y,8.5, "F1",INK);});
      rect(p2,40,704,W-80,64,GREEN);txt(p2,"A NOTE ABOUT THESE EXAMPLES",52,724,7.5,"F2",[0.91,0.79,0.62]);paragraph(p2,"The brand and content are fictional demonstrations, not testimonials, client results or a guarantee of scope. Every real project is agreed individually before work begins.",52,742,84,7.5,11,WHITE);
      footer(p2,2);
      var objects=[],pageIds=[];function add(v){objects.push(v);return objects.length;}
      var catalog=add(""),pages=add("");var regular=add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");var bold=add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
      [p1,p2].forEach(function(pg){var stream=pg.ops.join("\n")+"\n";var content=add("<< /Length "+stream.length+" >>\nstream\n"+stream+"endstream");pageIds.push(add("<< /Type /Page /Parent "+pages+" 0 R /MediaBox [0 0 "+W+" "+H+"] /Resources << /Font << /F1 "+regular+" 0 R /F2 "+bold+" 0 R >> >> /Contents "+content+" 0 R >>"));});
      objects[catalog-1]="<< /Type /Catalog /Pages "+pages+" 0 R >>";objects[pages-1]="<< /Type /Pages /Kids ["+pageIds.map(function(id){return id+" 0 R";}).join(" ")+"] /Count "+pageIds.length+" >>";
      var pdf="%PDF-1.4\n",offsets=[0];objects.forEach(function(o,i){offsets.push(pdf.length);pdf+=(i+1)+" 0 obj\n"+o+"\nendobj\n";});var xref=pdf.length;pdf+="xref\n0 "+(objects.length+1)+"\n0000000000 65535 f \n";for(var j=1;j<offsets.length;j++)pdf+=String(offsets[j]).padStart(10,"0")+" 00000 n \n";pdf+="trailer\n<< /Size "+(objects.length+1)+" /Root "+catalog+" 0 R >>\nstartxref\n"+xref+"\n%%EOF";
      var url=URL.createObjectURL(new Blob([pdf],{type:"application/pdf"}));var a=document.createElement("a");a.href=url;a.download="kioo-studio-creative-sample-pack.pdf";document.body.append(a);a.click();a.remove();window.setTimeout(function(){URL.revokeObjectURL(url);},1500);button.innerHTML=original;
    }catch(error){console.error("Sample pack PDF could not be created.",error);button.textContent="Please try the sample pack again";}
    finally{button.disabled=false;}
  });
})();