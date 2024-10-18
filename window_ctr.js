function image_resize() {
    const container_width = document.getElementById("main_container").offsetWidth;
    const basic_width  = 400;
    const canvas_width = container_width<=basic_width?container_width:basic_width;
    document.querySelector(".character-image").style.flex = `0 0 ${canvas_width}px`;        
}
window.onload=function(){
    image_resize();
}
window.addEventListener("resize", function() {
    image_resize();
})