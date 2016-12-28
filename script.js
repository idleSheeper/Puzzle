var empty = {row:3, col:3, img:15} ;
var moves = 0;
var level = 4;
var count = 16;
var width = 100;
var tab = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
var tabTemp = [];

$(document).ready(function() {
    
    //Add a new elememt of puzzle
    function addNewPuzzle(row, col, img){
            var newPuzzle = document.createElement('div');
            $(newPuzzle).addClass('puzzle')
            .attr('data-row', row)
            .attr('data-col', col)
            .attr('data-img', img)
            .css('left', col * width +'px')
            .css('top', row * width +'px')
            .css('width', width)
            .css('height', width)
            .css('background', 'url(' + $('select').find(':selected').val() +'.jpg')
            .css('background-position', img % level * -width + 'px ' + Math.floor(img/level) * -width + 'px')
            .prependTo($("#box")) 
        }
    //Reset parameters before new game
    function reset(){
        level = parseInt($('input[name=level]:checked').val());
        count = level * level;
        tabTemp = tab.slice(0, count-1);
        width = 400 / level;
        empty.row = level - 1;
        empty.col = level - 1; 
        empty.img = count - 1;
        moves = 0;
    }
    
    //Operate burrots
    $('.button.play').on('click', function(){
        $('#info').hide();
        reset();       
        for(var i = 0 ; i < count-1 ; i++)
                addNewPuzzle( Math.floor(i/level) , i%level, tabTemp.splice(Math.round(Math.random() * (tabTemp.length-1)),1));            
    });
    
    $('.button.reset').on('click', function(){
        $('.puzzle').remove();
        reset();
        for(var i = 0 ; i < count-1 ; i++)
                addNewPuzzle( Math.floor(i/level) , i%level, tabTemp.splice(Math.round(Math.random() * (tabTemp.length-1)),1));
    });
    
    // The change of picture
    $('select').on('change', function() {
        $('.puzzle').css('background', 'url(' + $(this).find(':selected').val() +'.jpg');
        $('.puzzle').each(function(){
            var index = $(this).attr('data-img');
            $(this).css('background-position', index % level * -width + 'px ' + Math.floor(index / level) * -width + 'px');
        });
    });
    
    // Shift elements
    $('#box').on('click', '.puzzle', function(){
        var distanceX = empty.col - $(this).attr('data-col');
        var distanceY = empty.row - $(this).attr('data-row');
        var modul = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

        if(modul === 1) {    
            if (distanceX > 0) $(this).animate({
                left: '+=' + width + 'px'
            }, 300);
            else if (distanceX < 0) $(this).animate({
                left: '-=' + width + 'px'
            }, 300);
            else if (distanceY > 0) $(this).animate({
                top: '+=' + width + 'px'
            }, 300);
            else if (distanceY < 0) $(this).animate({
                top: '-=' + width + 'px'
            }, 300);
            
            var tempX = empty.col;
            var tempY = empty.row;
            empty.row = $(this).attr('data-row');
            empty.col = $(this).attr('data-col');
            $(this).attr('data-row', tempY); 
            $(this).attr('data-col', tempX); 
            moves++;
            $('#moves').text('You did ' + moves + ' moves.');
            if(parseInt(empty.row) === level - 1 && parseInt(empty.col) === level - 1) isItTheEnd();
        }
    });
    
    function isItTheEnd(){
        var sum = 0;
        $('.puzzle').each(function(){
            var x = parseInt($(this).attr('data-col'));
            var y = parseInt($(this).attr('data-row')) ;
            var img = parseInt($(this).attr('data-img'));
            if( y * level + x === img ) sum++; 
        });
        if(sum === count-1) winner();
        else console.log('Not yet');
    }
    
    function winner(){
        addNewPuzzle(empty.row, empty.col, empty.img);
        $('.puzzle').first().show(500);       
        $('.puzzle').delay(2500).addClass('end');
        $( '#box' ).off('.puzzle' );
        var newText = 'Congratulations! You did it in '+ moves + ' moves!';
        $('#info').html(newText + ' <div class=\'button ok\'>OK</div>').show();
        $('#moves').text(newText);;
    }
    
    $('#info').on('click', '.ok', function(){
       $('#info').hide(); 
    });
    
});

