/*
 * busca los tags que empiezan <!-- START UNIQUE_KEY --> <!-- END UNIQUE_KEY -->
 * @return matchObject {} Mapa de String a  {start, end, text}. Donde la key es UNIQUE_KEY, start es donde empieza el primer <!-- y end donde termina el segundo -->
 */
function createMatchObject(matches) {
  const matchObject = {}; // mapa de key => { start: indice donde empieza, end: indice donde termina, text: texto entre ambos indices }
  const indices = [];
  for (const match of matches) {
    //const tag = match[0];
    const key = match[2].trim();
    const startOrEnd = match[1].toLowerCase().trim(); // guarda si el match es start o end
    if (matchObject[key] === undefined) {
      matchObject[key] = {};
    }
    if (matchObject[key][startOrEnd] !== undefined) {
      throw new Error(
        `No se puede hacer un merge porque hay mas de un ${startOrEnd} de ${key}. Debe haber uno solo por archivo `
      );
    }
    matchObject[key][startOrEnd] =
      startOrEnd === "start" ? match.index : match.index + match[0].length;

    const startIndex = matchObject[key].start;
    const endIndex = matchObject[key].end;
    if (startIndex !== undefined && endIndex !== undefined) {
      if (endIndex < startIndex) {
        throw new Error(
          `No se puede hacer un merge porque el start de ${key} esta despues del end`
        );
      }
      indices[startIndex] = endIndex;
      matchObject[key].text = match.input.substring(startIndex, endIndex);
    }
  }
  // Valida entradas incompletas
  for (const key of Object.keys(matchObject)) {
    if (
      matchObject[key].start === undefined ||
      matchObject[key].end === undefined
    ) {
      throw new Error(
        `No se puede hacer un merge porque ${key} no tiene una apertura y cierre`
      );
    }
  }
  // Valida que no haya anidamientos
  let lastEndIndex = 0;
  for (const start of Object.keys(indices).sort((a, b) => a - b)) {
    if (start < lastEndIndex) {
      throw new Error(
        `No se puede hacer un merge porque estan anidados los start y end tags`
      );
    }
    lastEndIndex = indices[start];
  }

  return matchObject;
}

function merge(newContent, existingContent, cleanNotExistingTags) {
  let mergeContent = existingContent;
  const regexp = /<!--[ ]*(start|end)[ ]*([^>]*)-->/gi;
  const newMatches = createMatchObject(newContent.matchAll(regexp));
  const existingMatches = createMatchObject(existingContent.matchAll(regexp));
  const newKeys = Object.keys(newMatches);
  const existingKeys = Object.keys(existingMatches);
  for (const key of newKeys) {
    // Por cada coincidencia reemplaza el texto existente por el texto nuevo
    if (existingKeys.includes(key)) {
      mergeContent = mergeContent.replace(
        existingMatches[key].text,
        newMatches[key].text
      );
    } else {
      // Si no esta lo appendea (ideal seria que quede en el lugar)
      mergeContent += "\n" + newMatches[key].text;
    }
  }

  // Borra los viejos
  if (cleanNotExistingTags) {
    for (const key of existingKeys) {
      if (!newKeys.includes(key)) {
        mergeContent = mergeContent.replace(existingMatches[key].text, "");
      }
    }
  }

  return mergeContent;
}

module.exports = { merge };

/* podria ser mas performante 

function createMatchArray(matches) {
    const matchObject = []; // mapa de key => { start: indice donde empieza, end: indice donde termina, text: texto entre ambos indices }
    let lastStartOrEnd, lastKey = '';
    let  lastFrom, lastTo = 0 ;

    for( const match of matches ) {
        const key = match[2].toLowerCase().trim();
        const from = match.index;
        const to = match.index + match[2].length;
        const startOrEnd = match[1].toLowerCase().trim(); // guarda si el match es start o end 

        if ( startOrEnd === 'end') {
            if ( key !== lastKey || lastStartOrEnd !== 'start') {
                throw new Error(`No se puede hacer un merge porque estan anidados los start y end tags`);
            }
            matchObject.push( {key, startFrom: lastFrom, startTo: lastTo, endFrom: from, endTo: to} );
        }
        lastKey = key;
        lastFrom = from;
        lastFrom = to;
        lastStartOrEnd = startOrEnd;
    }
    return matchObject;
}

function merge( newContent, existingContent ){
    const regexp = /<!--[ ]*(start|end)[ ]*([^>]*)-->/gi;
    const newMatches = createMatchArray(newContent.matchAll(regexp));
    const existingMatches = createMatchArray(existingContent.matchAll(regexp));

    const newKeys = newMatches.map( m => m.key );
    const existingKeys = existingMatches.map( m => m.key );

    let mergeContent = existingContent ;
    let currentNew = newMatches.pop(); 
    let currentExisting = existingMatches.pop(); 
    do {
        if ( currentNew.key ===  currentExisting.key) {
            
            mergeContent = mergeContent.substring(0, currentExisting.start ) + currentNew.text +  mergeContent.substring(currentExisting.end);
            currentNew = newMatches.pop(); 
            currentExisting = existingMatches.pop();         
        } else if ( !newKeys.includes(currentExisting.key) ) { 
            //Si la key existente no existe en el nuevo => Elimina

            mergeContent = mergeContent.substring() + mergeContent.substring();
            currentExisting = existingMatches.pop();         
        } else if ( !existingKeys.includes(currentNew.key) ) {
            //Si la key nueva no existe en el existente => Agrega

            mergeContent = mergeContent.substring() + currentNew.substring(); +  mergeContent.substring();            
            currentNew = newMatches.pop(); 
        } else { // Cambio de orden 
            throw new Error ('Merge no soporta que esten desordenados los start/end tags')
        }
    
    } while ( newMatches.length > 0 || existingContent.length > 0 );

}

*/
