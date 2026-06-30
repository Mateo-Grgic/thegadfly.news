/* =========================================================================
   THE GADFLY — "YOU CAN BREAK US!?"
   A brick breaker where the bricks are a random assortment of author faces.
   Self-contained, vanilla JS, no dependencies. Reads author image URLs from
   window.GADFLY_AUTHORS (set in game.html so Jekyll can build the paths).
   ========================================================================= */
(function () {
    'use strict';

    var canvas = document.getElementById('gadfly-game');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    var GREEN = '#09461d';
    var NEON = '#39ff14';
    var CREAM = '#fffdf4';
    var RED = '#ff2d4b';

    var authors = (window.GADFLY_AUTHORS || []).map(function (a) {
        var img = new Image();
        img.src = a.src;
        return { name: a.name, img: img };
    });

    /* quips shouted when a brick (author) breaks */
    var QUIPS = [
        'ow.', 'rude!', 'my face!', 'unionise!', 'you can break us!?',
        'idk man', 'censored!', 'this is satire', 'editor!!', 'libel!',
        'not the face', 'banned again'
    ];

    /* ---- responsive sizing ---- */
    var W, H, scale;
    function resize() {
        var maxW = Math.min(canvas.parentElement.clientWidth, 760);
        scale = maxW / 760;
        W = canvas.width = maxW;
        H = canvas.height = Math.round(520 * scale);
        layoutBricks();
    }

    /* ---- game state ---- */
    var paddle, ball, bricks, score, lives, state, quip, quipTimer;
    var ROWS = 4, COLS = 7;

    function newPaddle() {
        return { w: 110 * scale, h: 16 * scale, x: W / 2 - 55 * scale, y: H - 30 * scale };
    }
    function newBall() {
        return {
            r: 8 * scale,
            x: W / 2,
            y: H - 50 * scale,
            dx: (Math.random() < 0.5 ? -1 : 1) * 4 * scale,
            dy: -4.4 * scale,
            stuck: true
        };
    }

    function layoutBricks() {
        if (!bricks) return;
        var pad = 8 * scale;
        var offTop = 60 * scale;
        var offSide = 14 * scale;
        var bw = (W - offSide * 2 - pad * (COLS - 1)) / COLS;
        var bh = 42 * scale;
        var i = 0;
        for (var r = 0; r < ROWS; r++) {
            for (var c = 0; c < COLS; c++) {
                var b = bricks[i++];
                if (!b) continue;
                b.x = offSide + c * (bw + pad);
                b.y = offTop + r * (bh + pad);
                b.w = bw; b.h = bh;
            }
        }
    }

    function buildBricks() {
        bricks = [];
        if (!authors.length) return;
        for (var r = 0; r < ROWS; r++) {
            for (var c = 0; c < COLS; c++) {
                var a = authors[Math.floor(Math.random() * authors.length)];
                bricks.push({ author: a, alive: true, x: 0, y: 0, w: 0, h: 0 });
            }
        }
        layoutBricks();
    }

    function reset() {
        paddle = newPaddle();
        ball = newBall();
        buildBricks();
        score = 0;
        lives = 3;
        quip = '';
        state = 'start';
    }

    /* ---- input ---- */
    function movePaddleTo(clientX) {
        var rect = canvas.getBoundingClientRect();
        var x = clientX - rect.left;
        paddle.x = Math.max(0, Math.min(W - paddle.w, x - paddle.w / 2));
        if (ball.stuck) ball.x = paddle.x + paddle.w / 2;
    }
    canvas.addEventListener('mousemove', function (e) { movePaddleTo(e.clientX); });
    canvas.addEventListener('touchmove', function (e) {
        e.preventDefault();
        movePaddleTo(e.touches[0].clientX);
    }, { passive: false });

    function launchOrRestart() {
        if (state === 'start' || state === 'won' || state === 'lost') {
            if (state !== 'start') reset();
            state = 'playing';
            ball.stuck = false;
        } else if (ball.stuck) {
            ball.stuck = false;
        }
    }
    canvas.addEventListener('mousedown', launchOrRestart);
    canvas.addEventListener('touchstart', function (e) { e.preventDefault(); launchOrRestart(); }, { passive: false });
    document.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') {
            // only hijack space/enter when the canvas region is in view & not typing
            var t = document.activeElement;
            if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
            e.preventDefault();
            launchOrRestart();
        }
        if (e.key === 'ArrowLeft') { paddle.x = Math.max(0, paddle.x - 28 * scale); if (ball.stuck) ball.x = paddle.x + paddle.w / 2; }
        if (e.key === 'ArrowRight') { paddle.x = Math.min(W - paddle.w, paddle.x + 28 * scale); if (ball.stuck) ball.x = paddle.x + paddle.w / 2; }
    });

    function showQuip(text) {
        quip = text;
        quipTimer = 60;
    }

    /* ---- physics & update ---- */
    function update() {
        if (state !== 'playing') return;
        if (ball.stuck) return;

        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.x - ball.r < 0) { ball.x = ball.r; ball.dx *= -1; }
        if (ball.x + ball.r > W) { ball.x = W - ball.r; ball.dx *= -1; }
        if (ball.y - ball.r < 0) { ball.y = ball.r; ball.dy *= -1; }

        /* paddle collision */
        if (ball.dy > 0 &&
            ball.y + ball.r >= paddle.y &&
            ball.y + ball.r <= paddle.y + paddle.h + 12 * scale &&
            ball.x >= paddle.x && ball.x <= paddle.x + paddle.w) {
            ball.dy = -Math.abs(ball.dy);
            var hit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
            ball.dx = hit * 5 * scale;
        }

        /* brick collisions */
        for (var i = 0; i < bricks.length; i++) {
            var b = bricks[i];
            if (!b.alive) continue;
            if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + b.w &&
                ball.y + ball.r > b.y && ball.y - ball.r < b.y + b.h) {
                b.alive = false;
                score += 10;
                ball.dy *= -1;
                showQuip(QUIPS[Math.floor(Math.random() * QUIPS.length)]);
                /* tiny speed-up keeps it spicy */
                ball.dx *= 1.015; ball.dy *= 1.015;
                break;
            }
        }

        /* lose a life */
        if (ball.y - ball.r > H) {
            lives--;
            if (lives <= 0) { state = 'lost'; }
            else { ball = newBall(); paddle = newPaddle(); }
        }

        /* win */
        if (bricks.length && bricks.every(function (b) { return !b.alive; })) {
            state = 'won';
        }

        if (quipTimer > 0) quipTimer--; else quip = '';
    }

    /* ---- drawing ---- */
    function roundRect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    function drawBrick(b) {
        ctx.save();
        roundRect(b.x, b.y, b.w, b.h, 6 * scale);
        ctx.clip();
        if (b.author.img.complete && b.author.img.naturalWidth) {
            /* cover-fit the face into the brick */
            var iw = b.author.img.naturalWidth, ih = b.author.img.naturalHeight;
            var ar = iw / ih, br = b.w / b.h, sw, sh, sx, sy;
            if (ar > br) { sh = ih; sw = ih * br; sx = (iw - sw) / 2; sy = 0; }
            else { sw = iw; sh = iw / br; sx = 0; sy = (ih - sh) / 2; }
            ctx.drawImage(b.author.img, sx, sy, sw, sh, b.x, b.y, b.w, b.h);
        } else {
            ctx.fillStyle = GREEN;
            ctx.fillRect(b.x, b.y, b.w, b.h);
        }
        ctx.restore();
        ctx.strokeStyle = NEON;
        ctx.lineWidth = 2;
        roundRect(b.x, b.y, b.w, b.h, 6 * scale);
        ctx.stroke();
    }

    function centreText(lines, sub) {
        ctx.save();
        ctx.fillStyle = 'rgba(11,19,12,0.78)';
        ctx.fillRect(0, 0, W, H);
        ctx.textAlign = 'center';
        ctx.fillStyle = NEON;
        ctx.font = 'bold ' + Math.round(34 * scale) + "px 'Fira Mono', monospace";
        ctx.fillText(lines, W / 2, H / 2 - 10 * scale);
        ctx.fillStyle = CREAM;
        ctx.font = Math.round(16 * scale) + "px 'Fira Mono', monospace";
        ctx.fillText(sub, W / 2, H / 2 + 26 * scale);
        ctx.restore();
    }

    function draw() {
        /* backdrop */
        ctx.fillStyle = '#0b130c';
        ctx.fillRect(0, 0, W, H);

        /* bricks */
        for (var i = 0; i < bricks.length; i++) if (bricks[i].alive) drawBrick(bricks[i]);

        /* paddle */
        ctx.fillStyle = CREAM;
        roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 8 * scale);
        ctx.fill();

        /* ball */
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fillStyle = NEON;
        ctx.shadowColor = NEON; ctx.shadowBlur = 14 * scale;
        ctx.fill();
        ctx.shadowBlur = 0;

        /* HUD */
        ctx.fillStyle = CREAM;
        ctx.textAlign = 'left';
        ctx.font = 'bold ' + Math.round(16 * scale) + "px 'Fira Mono', monospace";
        ctx.fillText('SCORE ' + score, 14 * scale, 26 * scale);
        ctx.textAlign = 'right';
        ctx.fillStyle = RED;
        ctx.fillText('LIVES ' + '●'.repeat(Math.max(0, lives)), W - 14 * scale, 26 * scale);

        /* quip bubble */
        if (quip) {
            ctx.textAlign = 'center';
            ctx.fillStyle = NEON;
            ctx.font = 'bold ' + Math.round(18 * scale) + "px 'Fira Mono', monospace";
            ctx.fillText('“' + quip + '”', W / 2, H - 6 * scale);
        }

        /* overlays */
        if (state === 'start') centreText('YOU CAN BREAK US!?', 'click / tap / space to launch');
        if (state === 'won') centreText('you broke us. happy now?', 'click to humiliate us again');
        if (state === 'lost') centreText('the editors survive.', 'click to try again');
        if (state === 'playing' && ball.stuck) centreText('ready...', 'click / space to serve');
    }

    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    reset();
    resize();
    loop();
})();

