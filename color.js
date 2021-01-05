export function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  

  export function getRandomColorArray (length){
    let colors = []
    for(let i = 0; i < length; i++){
      colors.push(getRandomColor())
    }
    return colors
  }