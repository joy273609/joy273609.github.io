$(function () {
    // 點擊卡片顯示對應 modal
    $(".card").click(function () {
    const target = $(this).data("target");
    $(".modal-overlay").fadeIn(200);
    $(target).fadeIn(200);
    });

    // 點擊關閉按鈕或遮罩關閉所有 modal
    $(".close-btn, .modal-overlay").click(function () {
    $(".modal-overlay").fadeOut(200);
    $(".modal").fadeOut(200);
    });
});

//跑馬燈
$(function(){
    $("#openExhibition").click(function(){
    $("#overlay, #modal-EXHIBITION").fadeIn(200);
    });
    $("#closeExhibition, #overlay").click(function(){
    $("#overlay, #modal-EXHIBITION").fadeOut(200);
    });
});
