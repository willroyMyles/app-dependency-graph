const r = 30
export default  {
    radius : r,
    sideWidth : screen.width * .2,
    content_width : screen.width  ,
    width : screen.width * .8,
    height : screen.height * .84,
    textOffset : (val : number) => val + r* 1.5
}