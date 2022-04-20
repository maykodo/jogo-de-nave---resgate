
function start() {
    $("#inicio").hide()

    //inicializar personagens e interface no cenario
    $("#fundoGame").append("<div id='jogador' class ='anima1'></div>")
    $("#fundoGame").append("<div id='inimigo1' class ='anima2'></div>")
    $("#fundoGame").append("<div id='inimigo2'></div>")
    $("#fundoGame").append("<div id='amigo' class ='anima3'></div>")
    $("#fundoGame").append("<div id='placar'></div>")
    $("#fundoGame").append("<div id='energia'></div>")

    let jogo = {}
    let Tecla = {
        W: 87,
        S: 83,
        D: 68
    }
    
    let velocidade = 5
    
    let posicaoY = parseInt(Math.random() * 334)
    
    let podeAtirar = true
    let tempoDisparo = null
    
    let vidas = 3
    let fimdeJogo =false

    let pontuacao = 0
    let amigosSalvos = 0
    let amigosMortos = 0

   
    jogo.pressionou = []

    let somDisparo = document.getElementById("somDisparo")
    let somExplosao = document.getElementById("somExplosao")
    let musica = document.getElementById("musica")
    let somGameOver = document.getElementById("somGameOver")
    let somPerdido = document.getElementById("somPerdido")
    let somResgate = document.getElementById("somResgate")

    musica.addEventListener("ended", function() {
        musica.currentTime = 0 
        musica.play()
    }, false)

    //verificar se o usuario pressionou alguma tecla

    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true
    })

    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false
    })

    moverInimigo()

    jogo.timer = setInterval(loop, 30)

    function loop() {
        moverFundo()
        moverJogador()
        moverInimigo()
        moverInimigo2()
        moverAmigo()
        colisao()
        placar()
        vida()
    }

    function gameOver() {
        fimdeJogo = true
        musica.pause()
        somGameOver.play()

        window.clearInterval(jogo.timer)
        jogo.timer = null

        $("#inimigo1").remove()
        $("#inimigo2").remove()
        $("#jogador").remove()
        $("#amigo").remove()

        $("#fundoGame").append("<div id='fim'></div>")

        $("#fim").html("<h1> Game Over </h1><p>Sua Pontuacao foi: " + pontuacao + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>")
    }

    function vida() {
        if(vidas > 0){
            $("#energia").css("background-image", "url(imgs/energia" + vidas + ".png)")
        } if(vidas === 0) {
            $("#energia").css("background-image", "url(imgs/energia" + vidas + ".png)")
            gameOver()
        }
    }

    function placar() {
        $("#placar").html("<h2> Pontos: " + pontuacao + " Salvos: " + amigosSalvos + " Mortos: " + amigosMortos )
    }
    
    function moverJogador(){
        if(jogo.pressionou[Tecla.W]){
            let topo = parseInt($("#jogador").css("top"))

            $("#jogador").css("top", topo-10)
            if(topo <= 0){
                $("#jogador").css("top", topo+10)
            }
        }

        if(jogo.pressionou[Tecla.S]){
            let topo = parseInt($("#jogador").css("top"))

            $("#jogador").css("top", topo+10)
            if(topo >= 434){
                $("#jogador").css("top", topo-10)
            }
        }

        if(jogo.pressionou[Tecla.D]){
            disparo()
        }
    }

    function moverInimigo() {
        posicaoX = parseInt($("#inimigo1").css("left"))
        //console.log(`PosiscaoX: ${posicaoX}`)
        $("#inimigo1").css("left", posicaoX - velocidade)
        $("#inimigo1").css("top", posicaoY)

        if(posicaoX <= 0) {
            posicaoY = parseInt(Math.random() * 334)
            //console.log(`PosiscaoY: ${posicaoY}`)
            $("#inimigo1").css("left", 694)
            $("#inimigo1").css("top", posicaoY)
        }
    }

    function moverInimigo2() {
        posicaoX = parseInt($("#inimigo2").css("left"))
        $("#inimigo2").css("left", posicaoX - 3)

        if(posicaoX <=0) {
            $("#inimigo2").css("left", 775)
        }
    }

    function moverAmigo() {
        posicaoX = parseInt($("#amigo").css("left"))
        $("#amigo").css("left", posicaoX + 1)

        if(posicaoX > 906) {
            $("#amigo").css("left", 0)
        }
    }
    
    function moverFundo() {
        esquerda = parseInt($("#fundoGame").css("background-position"))
        $("#fundoGame").css("background-position", esquerda-1)
    }

    function disparo() {
        if(podeAtirar === true) {
            podeAtirar = false

            somDisparo.play()

            topo = parseInt($("#jogador").css("top"))
            posicaoX = parseInt($("#jogador").css("left"))
            
            tiroX = posicaoX + 190
            topoTiro = topo + 37

            $("#fundoGame").append("<div id='disparo'></div>")
            $("#disparo").css("top", topoTiro)
            $("#disparo").css("left", tiroX)

            tempoDisparo = window.setInterval(executaDisparo, 30)
        }
    }

    function executaDisparo(){
        posicaoX = parseInt($("#disparo").css("left"))
        $("#disparo").css("left", posicaoX + 15)

        if(posicaoX >= 900){
            window.clearInterval(tempoDisparo)
            tempoDisparo= null

            $("#disparo").remove()
            podeAtirar = true
        }
    }

    function colisao(){
    
        let colisao1 = ($("#jogador").collision($("#inimigo1")))
        let colisao2 = ($("#jogador").collision($("#inimigo2")))
        let colisao3 = ($("#disparo").collision($("#inimigo1")))
        let colisao4 = ($("#disparo").collision($("#inimigo2")))
        let colisao5 = ($("#jogador").collision($("#amigo")))
        let colisao6 = ($("#inimigo2").collision($("#amigo")))
    
        //colisao jogador com inimigo1
        if( colisao1.length > 0) {
            inimigo1X = parseInt($("#inimigo1").css("left"))
            inimigo1Y = parseInt($("#inimigo1").css("top"))
            explosao1(inimigo1X, inimigo1Y)

            posicaoY = parseInt(Math.random() * 334)
            $("#inimigo1").css("left", 694)
            $("#inimigo1").css("top", posicaoY)

            vidas--
        }

        //colisao jogador com inimigo2
        if( colisao2.length > 0) {
            inimigo2X = parseInt($("#inimigo2").css("left"))
            inimigo2Y = parseInt($("#inimigo2").css("top"))
            explosao2(inimigo2X, inimigo2Y)

            $("#inimigo2").remove()

            reposicionarInimigo2()

            vidas--
        }

        //colisao disparo com inimigo1
        if( colisao3.length > 0) {
            inimigo1X = parseInt($("#inimigo1").css("left"))
            inimigo1Y = parseInt($("#inimigo1").css("top"))
            explosao1(inimigo1X, inimigo1Y)

            $("#disparo").css("left", 950)

            posicaoY = parseInt(Math.random() * 334)
            $("#inimigo1").css("left", 694)
            $("#inimigo1").css("top", posicaoY)

            pontuacao += 100
            velocidade += 0.3
        }

        //colisao disparo com inimigo2
        if( colisao4.length > 0) {
            inimigo2X = parseInt($("#inimigo2").css("left"))
            inimigo2Y = parseInt($("#inimigo2").css("top"))
            explosao2(inimigo2X, inimigo2Y)

            $("#inimigo2").remove()
            $("#disparo").css("left", 950)

            reposicionarInimigo2()

            pontuacao += 50
        }

        //colisao jogador com amigo
        if( colisao5.length > 0) {
            reposicionarAmigo()

            $("#amigo").remove()
            amigosSalvos++
            pontuacao += 100
            somResgate.play()
        }

        //colisao inimigo2 com amigo
        if( colisao6.length > 0) {
            amigoX = parseInt($("#amigo").css("left"))
            amigoY = parseInt($("#amigo").css("top"))
            explosao3(amigoX, amigoY)

            $("#amigo").remove()

            reposicionarAmigo()

            amigosMortos++
            somResgate.play()
        }

        function explosao1 (inimigo1X, inimigo1Y) {
            $("#fundoGame").append("<div id='explosao1'></div>")
            $("#explosao1").css("background-image", "url(imgs/explosao.png")
        
            let div = $("#explosao1")
            div.css("top", inimigo1Y)
            div.css("left", inimigo1X)
            div.animate({width:200, opacity:0}, "slow")
            somExplosao.play()

            let tempoExplosao = window.setInterval(removeExplosao, 1000)

            function removeExplosao(){
                div.remove()
                window.clearInterval(tempoExplosao)
                tempoExplosao = null
            }
        }

        function explosao2(inimigo2X, inimigo2Y){
            $("#fundoGame").append("<div id='explosao2'></div>")
            $("#explosao2").css("background-image", "(url:imgs/explosao.png)")

            let div2 = $("#explosao2")
            div2.css("top", inimigo2Y)
            div2.css("left", inimigo2X)
            div2.animate({width: 200, opacity: 0}, 'slow')
            somExplosao.play()

            let tempoExplosao2 = window.setInterval(removeExplosao2, 1000)

            function removeExplosao2() {
                div2.remove()
                window.clearInterval(tempoExplosao2)
                tempoExplosao2 = null
            }
        }  
        
        function explosao3(amigoX, amigoY){
            $("#fundoGame").append("<div id='explosao3' class='anima4'></div>")

            let div2 = $("#explosao3")
            div2.css("top", amigoY)
            div2.css("left", amigoX)
            div2.animate({width: 200, opacity: 0}, 'slow')
            somPerdido.play()

            let tempoExplosao3 = window.setInterval(removeExplosao3, 1000)

            function removeExplosao3() {
                div2.remove()
                window.clearInterval(tempoExplosao3)
                tempoExplosao3 = null
            }
        } 

        function reposicionarInimigo2() {
            let tempoColisao4 = window.setInterval(reposicionar4, 5000)

            function reposicionar4() {
                window.clearInterval(tempoColisao4)
                tempocolisao4 = null

                if( fimdeJogo == false) {
                    $("#fundoGame").append("<div id='inimigo2'></div>")
                }
            }
        }

        function reposicionarAmigo() {
            let tempoAmigo = window.setInterval(reposicionar6, 6000)

            function reposicionar6() {
                window.clearInterval(tempoAmigo)
                tempoAmigo = null

                if(fimdeJogo === false) {
                    $("#fundoGame").append("<div id='amigo' class='anima3'></div>")
                }
            }
        }
    }
}

function reiniciaJogo() {
    somGameOver.pause()
    $("#fim").remove()
    start()
}

