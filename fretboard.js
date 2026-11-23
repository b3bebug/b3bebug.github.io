const noteLabels = new Array("C","C#","D","D#","E","F","F#","G","G#","A","A#","B");
const openStrings = new Array(4, 11, 7, 2, 9, 4); // E4, B3, G3, D3, A2, E2

const patterns = {
  minPent: new Array(0, 3, 5, 7, 10),
  blues: new Array(0, 3, 5, 6, 7, 10),
  majPent: new Array(0, 2, 4, 7, 9),
  major: new Array(0, 2, 4, 5, 7, 9, 11),
  minor: new Array(0, 2, 3, 5, 7, 8, 10),
  majChord: new Array(0, 4, 7),
  minChord: new Array(0, 3, 7)
};

function drawFretboard(){
  const board = document.getElementById('fretboard');
  const nums = document.getElementById('fretNums');
  if(!board || !nums) return;

  const root = parseInt(document.getElementById('rootNote').value) || 0;
  const type = document.getElementById('scaleType').value;
  const intervals = patterns[type] || patterns.minPent;

  board.innerHTML = '';
  nums.innerHTML = '';

  openStrings.forEach(openNote => {
    for(let fret = 0; fret <= 12; fret++){
      const cell = document.createElement('div');
      cell.className = 'fret-cell' + (fret === 0 ? ' nut' : '');
      const currentNote = (openNote + fret) % 12;
      const interval = (currentNote - root + 12) % 12;

      if(intervals.includes(interval)){
        const dot = document.createElement('div');
        dot.className = 'note-dot' + (interval === 0 ? ' root' : '');
        dot.innerText = noteLabels.at(currentNote);
        cell.appendChild(dot);
      }
      board.appendChild(cell);
    }
  });

  for(let f = 0; f <= 12; f++){
    const numCell = document.createElement('div');
    numCell.innerText = f === 0 ? 'Open' : f;
    nums.appendChild(numCell);
  }
}

drawFretboard();

