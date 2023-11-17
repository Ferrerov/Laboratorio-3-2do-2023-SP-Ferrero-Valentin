export const generarTable = (datos, head = datos[0]) => {
  if (!(datos.constructor === Array)) return null;
  const table = document.createElement("table");
  table.appendChild(generarHead(head, true));
  table.appendChild(generarBody(datos, head));

  return table;
};

const generarHead = (primerDato, id) => {
  const tHead = document.createElement("thead");
  const tr = document.createElement("tr");
  for (const key in primerDato) {
    const value = primerDato[key];
    const th = document.createElement("th");
    th.textContent = value;
    if(id) th.id = key;
    tr.appendChild(th);
  }
  tHead.appendChild(tr);

  return tHead;
};

const generarBody = (datosParaCargar, head) => {
  const tBody = document.createElement("tbody");

  datosParaCargar.forEach((element) => {
    const tr = document.createElement("tr");
    for (const keyHead in head) {
      const td = document.createElement("td");
      for (const keyElement in element) {
        if (keyHead === keyElement) {
          td.textContent = element[keyElement];
          td.className = keyElement;
          break;
        } else if(keyHead === "modificar" && !td.hasChildNodes()) {
          const btn = document.createElement('input');
          btn.type = "button";
          btn.className = "btnModificar";
          btn.value = "✎";
          td.appendChild(btn);
        } else if(keyHead === "eliminar" && !td.hasChildNodes()) {
          const btn = document.createElement('input');
          btn.type = "button";
          btn.className = "btnEliminar";
          btn.value = "⤬";
          td.appendChild(btn);
        }
         else if(!td.hasChildNodes()){
            td.textContent = "N/A";
        }
      }
      tr.appendChild(td);
    }
    tBody.appendChild(tr);
  });

  return tBody;
};