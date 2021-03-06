/*
 *
 *
 * Image Area Select
 * =================
 *
 * This FX provides a packaged
 * `jQuery imgAreaSelect Plugin <http://odyniec.net/projects/imgareaselect/>`_.
 *
 * Example 1
 * ---------
 * fx="imgareaselect[previewid=preview;foursquare;valueid=value]"
 *
 * .. zarkfx:: :demo:
 *
 *       <img src="http://p4.42qu.us/721/694/83638.jpg" fx="imgareaselect[previewid=preview;foursquare;valueid=value]"/>
 *       <div id="preview" style="width:96px; height:96px;"></div>
 *       <input id="value" type="text" autocomplete="off" />
 *
 * 默认选中区域
 * ------------
 * fx="imgareaselect[previewid=preview2;valueid=value2]"
 *
 * 给valueid所制定的input一个默认值即可
 *
 * .. zarkfx:: :demo:
 *
 *       <img src="http://p4.42qu.us/721/694/83638.jpg" fx="imgareaselect[previewid=preview2;valueid=value2]"/>
 *       <div id="preview2" style="width:200px; height:50px;"></div>
 *       <input id="value2" type="text" value="100 100 300 150" autocomplete="off" />
 *
 *
 *
 */

;(function(){
FX.register('imgareaselect', [ 'imgareaselect' ], {
    fxvar:       undefined,
    style:       'default',
    previewid:  undefined,
    valueid:     undefined,
    aspectRatio: undefined,
    handles:    true,
    x1:         0,
    x2:         50,
    y1:         0,
    y2:         50,
    foursquare: false,
    show:       true,
    keys:       false

}, function(attrs) {

    if (attrs.style !== 'none'){
        FX.loadCSS('imgareaselect/imgareaselect-'+attrs.style+'.css');
    };

    var $this = $(this);
    var change_functions = [];

    if(attrs.previewid){
        var $preview = $('#'+attrs.previewid);
        $('<img/>').attr('src',$(this).attr('src')).css({display:'inline'}).appendTo('#'+attrs.previewid);
        $preview.css({overflow:'hidden', margin:'auto'});

        change_functions.push(function(img, selection){
            if ( !! selection.width && !! selection.height) {
                var e = $preview.width() / selection.width,
                    f = $preview.height() / selection.height;
                $("img", $preview).css({
                    width: Math.round(e * $this.width()),
                    height: Math.round(f * $this.height()),
                    marginLeft: -Math.round(e * selection.x1),
                    marginTop: -Math.round(f * selection.y1)
                });
            };
        });
    };

    if(attrs.valueid){
        var $value = $('#'+attrs.valueid);
        change_functions.push(function(img, selection){
            $value.val(selection.x1 + " " + selection.y1 + " " + selection.width + " " + selection.height);
        });
        var values = $value.val().split(' ');
        if (values.length === 4){
            if (!attrs.x1) attrs.x1 = parseInt(values[0]);
            if (!attrs.x2) attrs.x2 = attrs.x1 + parseInt(values[2]);
            if (!attrs.y1) attrs.y1 = parseInt(values[1]);
            if (!attrs.y2) attrs.y2 = attrs.y1 + parseInt(values[3]);
        };
    };

    if(attrs.foursquare) {
        attrs.aspectRatio = "1:1";
        delete attrs.foursquare;
    }else if(!attrs.aspectRatio){
        delete attrs.aspectRatio;
    };

    if(attrs.aspectRatio){
        var w = parseInt(attrs.aspectRatio.split(':')[0]),
            h = parseInt(attrs.aspectRatio.split(':')[1]);
        attrs.y2 = Math.round(attrs.y1 + (attrs.x2-attrs.x1) * h / w);
    };

    attrs.onSelectChange = function(img, selection){
        for(var i in change_functions){
            change_functions[i](img, selection);
        };
    };
    attrs.onSelectBegin = attrs.onSelectChange;
    attrs.onSelectEnd = attrs.onSelectChange;
    attrs.onInit = attrs.onSelectChange;

    // 偏一修正, 如果没有这个修正, 那么得到的attrs.x2可能会超过真正的宽度
    if ($this.width() > attrs.x1){ //某些浏览器下, $this.width()可能为0
        attrs.x2 = Math.min(attrs.x2, $this.width());
    }
    if ($this.height() > attrs.y1){ //某些浏览器下, $this.height()可能为0
        attrs.y2 = Math.min(attrs.y2, $this.height());
    }

    // 修正, 要求x2 y2要比x1 y1大
    attrs.x2 = Math.max(attrs.x2, attrs.x1 + 1);
    attrs.y2 = Math.max(attrs.y2, attrs.y1 + 1);

    if(!attrs["fx_var"]) {
        $this.imgAreaSelect(attrs);
    } else {
        eval("$(this).imgAreaSelect(" + attrs["fx_var"] + ")");
    };

});
})();
