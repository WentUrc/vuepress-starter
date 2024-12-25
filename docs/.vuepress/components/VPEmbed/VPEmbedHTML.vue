<template>
    <div class="abdsos">
      <EmbedHtml :htmlContent="embeddedHtml" width="100%" height="600px" />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import EmbedHtml from './VPMeow.vue';
  
  export default defineComponent({
    name: 'App',
    components: {
      EmbedHtml,
    },
    data() {
      return {
        embeddedHtml: `
            <!DOCTYPE html>
            <body>
                <div class="playground">
                    <div class="washing-machine">
                        <div class="board">
                            <div class="button"></div>
                            <div class="button"></div>
                            <div class="button circle"></div>
                            <div class="button circle"></div>
                        </div>
                        <div class="window">
                            <div class="content">
                                <div class="sock orange"></div>
                                <div class="sock green"></div>
                                <div class="sock red"></div>
                                <div class="cat">
                                    <div class="head">
                                        <div class="ear"></div>
                                        <div class="ear right"></div>
                                        <div class="eye"></div>
                                        <div class="eye"></div>
                                    </div>
                                    <div class="body"></div>
                                    <div class="feet"></div>
                                    <div class="tail"></div>
                                </div>
                            </div>
                            <div class="bubbles">
                                <div class="bubble"></div>
                                <div class="bubble"></div>
                                <div class="bubble"></div>
                                <div class="bubble"></div>
                                <div class="bubble"></div>
                                <div class="bubble"></div>
                                <div class="bubble"></div>
                                <div class="bubble"></div>
                                <div class="bubble"></div>
                                <div class="bubble"></div>
                                <div class="bubble"></div>
                                <div class="bubble"></div>
                                <div class="bubble"></div>
                                <div class="bubble"></div>
                                <div class="bubble"></div>
                            </div>
                        </div>
                        <div class="badge">
                            <div class="line"></div>
                            <div class="line"></div>
                            <div class="line"></div>
                        </div>
                    </div>
                    <div class="clothes">
                        <div class="shirt white"></div>
                        <div class="shirt orange"></div>
                        <div class="shirt"></div>
                    </div>
                    <div class="shadow"></div>
                </div>
            </body>

            <style>
                *,*::before,*::after {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box
                }
                
                :root {
                    --timing: 2500ms
                }
                
                body {
                    display: grid;
                    place-items: center;
                    height: 100vh;
                    overflow: hidden;
                    background-color: #69B6E1;
                    font-size: clamp(0.6rem,calc(1vw+0.1rem),1.5rem)
                }
                
                body * {
                    position: absolute
                }
                
                body *::before,body *::after {
                    position: absolute
                }
                
                .playground {
                    --bottom-elements: 2.4em;
                    --main-width: 30em;
                    width: var(--main-width);
                    height: var(--main-width)
                }
                
                .shadow {
                    width: calc(var(--main-width)+5em);
                    height: 1em;
                    border-radius: .5em;
                    bottom: 2em;
                    left: .5em;
                    background-color: rgba(0,0,0,0.2);
                    z-index: -1
                }
                
                .washing-machine {
                    --delay-animation: 500ms;
                    width: 17.5em;
                    height: 25em;
                    animation: shake-machine var(--time,2500ms) var(--delay,0ms) infinite ease;
                    bottom: var(--bottom-elements);
                    left: 4em;
                    border-radius: 2.5em 2.5em 1em 1em;
                    background: linear-gradient(#F2FBFF 82%,#E5EBEE 82%,#E5EBEE 83%,#F2FBFF 83%);
                    box-shadow: 4.25em 0 #C5C7C8;
                    z-index: 1
                }
                
                @keyframes shake-machine {
                    10% {
                        transform: translateY(-0.125em)
                    }
                
                    11% {
                        transform: translateY(0)
                    }
                
                    12% {
                        transform: translateY(-0.125em)
                    }
                
                    13% {
                        transform: translateY(0)
                    }
                
                    14% {
                        transform: translateY(-0.125em)
                    }
                
                    15% {
                        transform: translateY(0)
                    }
                
                    16% {
                        transform: translateY(-0.125em)
                    }
                
                    17% {
                        transform: translateY(0)
                    }
                
                    18% {
                        transform: translateY(-0.125em)
                    }
                
                    19% {
                        transform: translateY(0)
                    }
                
                    20% {
                        transform: translateY(-0.125em)
                    }
                
                    21% {
                        transform: translateY(0)
                    }
                
                    22% {
                        transform: translateY(-0.125em)
                    }
                
                    23% {
                        transform: translateY(0)
                    }
                
                    24% {
                        transform: translateY(-0.125em)
                    }
                
                    25% {
                        transform: translateY(0)
                    }
                
                    26% {
                        transform: translateY(-0.125em)
                    }
                
                    27% {
                        transform: translateY(0)
                    }
                
                    28% {
                        transform: translateY(-0.125em)
                    }
                
                    29% {
                        transform: translateY(0)
                    }
                
                    30% {
                        transform: translateY(-0.125em)
                    }
                
                    31% {
                        transform: translateY(0)
                    }
                
                    32% {
                        transform: translateY(-0.125em)
                    }
                
                    33% {
                        transform: translateY(0)
                    }
                
                    34% {
                        transform: translateY(-0.125em)
                    }
                
                    35% {
                        transform: translateY(0)
                    }
                
                    36% {
                        transform: translateY(-0.125em)
                    }
                
                    37% {
                        transform: translateY(0)
                    }
                
                    38% {
                        transform: translateY(-0.125em)
                    }
                
                    39% {
                        transform: translateY(0)
                    }
                
                    40% {
                        transform: translateY(-0.125em)
                    }
                
                    41% {
                        transform: translateY(0)
                    }
                
                    42% {
                        transform: translateY(-0.125em)
                    }
                
                    43% {
                        transform: translateY(0)
                    }
                
                    44% {
                        transform: translateY(-0.125em)
                    }
                
                    45% {
                        transform: translateY(0)
                    }
                
                    46% {
                        transform: translateY(-0.125em)
                    }
                
                    47% {
                        transform: translateY(0)
                    }
                
                    48% {
                        transform: translateY(-0.125em)
                    }
                
                    49% {
                        transform: translateY(0)
                    }
                
                    50% {
                        transform: translateY(-0.125em)
                    }
                
                    51% {
                        transform: translateY(0)
                    }
                
                    52% {
                        transform: translateY(-0.125em)
                    }
                
                    53% {
                        transform: translateY(0)
                    }
                }
                
                .washing-machine .board {
                    width: 90%;
                    height: 2.5em;
                    display: flex;
                    align-items: center;
                    gap: .5em;
                    padding-inline:1.5em;top: 2.25em;
                    left: 5%;
                    border-radius: 1em;
                    background-color: #E8F1F4
                }
                
                .washing-machine .board .button {
                    width: 1.5em;
                    height: .65em;
                    position: static;
                    border-radius: .15em;
                    background-color: #D9DDDF;
                    box-shadow: .15em 0 #C2C4C6
                }
                
                .washing-machine .board .button:nth-of-type(2) {
                    margin-right: auto
                }
                
                .washing-machine .board .button.circle {
                    width: 1.2em;
                    height: 1.2em;
                    border-radius: 50%
                }
                
                .washing-machine .badge {
                    width: 3.25em;
                    height: 1.85em;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;
                    padding-block:.35em;bottom: .65em;
                    right: 2em;
                    background-color: #E5EBEE;
                    box-shadow: -0.15em 0 #C5C7C8;
                    border-radius: .25em
                }
                
                .washing-machine .badge::before {
                    width: 1.25em;
                    height: .2em;
                    content: "";
                    top: -0.2em;
                    background-color: #D4D8DA;
                    border-radius: .05em .05em 0 0;
                    z-index: -1
                }
                
                .washing-machine .badge .line {
                    width: 65%;
                    height: .175em;
                    flex: none;
                    position: static;
                    border-radius: .1em;
                    background-color: #D4D8DA
                }
                
                .clothes {
                    right: -4em;
                    bottom: var(--bottom-elements)
                }
                
                .clothes .shirt {
                    --bg: #FCB900;
                    --shadow: #D59800;
                    --extra-bg: linear-gradient(transparent,transparent);
                    --shadow-size: 85%;
                    --height: .75em;
                    width: 7em;
                    height: var(--height);
                    position: static;
                    border-radius: calc(var(--height) / 2);
                    background: var(--extra-bg),radial-gradient(circle calc(var(--height) / 2) at var(--shadow-size) 50%,var(--bg) 100%,transparent 0),linear-gradient(90deg,var(--bg) var(--shadow-size),var(--shadow) var(--shadow-size))
                }
                
                .clothes .shirt.orange {
                    --bg: #EE6E02;
                    --shadow: #C55602
                }
                
                .clothes .shirt.white {
                    --extra-bg-color: #CCD0D2;
                    --bg: #F7EAEA;
                    --shadow: #CCD0D2;
                    --extra-bg: linear-gradient(90deg,transparent 60%,var(--extra-bg-color) 60%,var(--extra-bg-color) 63%,transparent 63%),linear-gradient(90deg,transparent 65%,var(--extra-bg-color) 65%,var(--extra-bg-color) 68%,transparent 68%)
                }
                
                .window {
                    --border-color: #E5EBEE;
                    --bg-color: #6E6D71;
                    width: 12.25em;
                    height: 12.25em;
                    left: 9em;
                    top: 7em;
                    transform: translateX(-50%);
                    border-radius: 50%;
                    box-shadow: .6em 0 #C5C7C8;
                    background-color: var(--bg-color);
                    overflow: hidden;
                    z-index: 1
                }
                
                .window::before {
                    width: 100%;
                    height: 100%;
                    --opacity-color: rgba(255,255,255,0.15);
                    content: "";
                    box-shadow: 0 0 0 1.5em var(--border-color) inset;
                    border-radius: 50%;
                    z-index: 10;
                    background: linear-gradient(-45deg,transparent 53%,var(--opacity-color) 53%,var(--opacity-color) 55%,transparent 55%,transparent 59%,var(--opacity-color) 59%,var(--opacity-color) 65%,transparent 65%)
                }
                
                .window::after {
                    width: 4em;
                    height: 4em;
                    content: "";
                    right: -0.55em;
                    top: 50%;
                    transform: translateY(-50%);
                    border-radius: 50%;
                    background-color: var(--border-color)
                }
                
                .content {
                    width: 100%;
                    height: 100%;
                    animation: content-rotate var(--time,2500ms) var(--delay,0ms) infinite ease-in-out
                }
                
                @keyframes content-rotate {
                    0%,55% {
                        transform: rotate(-3turn)
                    }
                
                    24%,48% {
                        filter: blur(0.075em)
                    }
                
                    48% {
                        filter: none
                    }
                
                    55% {
                        transform: initial
                    }
                }
                
                .cat {
                    --bg-cat: #2A2538;
                    width: 4.5em;
                    height: 6.5em;
                    left: 3.95em;
                    bottom: 1em;
                    transform-origin: center top
                }
                
                .cat .head {
                    width: 100%;
                    height: 2em;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: .15em;
                    top: .75em;
                    border-radius: 1em;
                    background-color: var(--bg-cat)
                }
                
                .cat .head .eye {
                    width: .75em;
                    height: .75em;
                    position: static;
                    margin-top: -0.325em;
                    border-radius: 50%;
                    clip-path: polygon(0 50%,100% 50%,100% 100%,0 100%);
                    background: radial-gradient(circle .15em at 50% 50%,black 100%,transparent 0),white
                }
                
                .cat .head .ear {
                    --height: .75em;
                    --width: .45em;
                    --position: 1.1em;
                    width: 0;
                    border-style: solid;
                    border-width: 0 var(--width) var(--height) var(--width);
                    border-color: transparent transparent var(--bg-cat) transparent;
                    top: calc(var(--height) * -1);
                    left: var(--position)
                }
                
                .cat .head .ear.right {
                    left: initial;
                    right: var(--position);
                    z-index: 5;
                    transform-origin: bottom left;
                    animation: ear-animation var(--time,2500ms) var(--delay,0ms) infinite ease
                }
                
                @keyframes ear-animation {
                    0%,68%,78%,86% {
                        transform: skew(0)
                    }
                
                    74%,82% {
                        transform: skew(-40deg)
                    }
                }
                
                .cat .body {
                    width: 70%;
                    height: 3.35em;
                    top: 2.65em;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: var(--bg-cat)
                }
                
                .cat .feet {
                    width: 4.75em;
                    height: 1.25em;
                    bottom: .7em;
                    right: -0.25em;
                    border-radius: .75em;
                    background-color: var(--bg-cat)
                }
                
                .cat .tail {
                    width: 4.5em;
                    height: 4.5em;
                    left: -2.25em;
                    bottom: 1.25em;
                    border-radius: 50%;
                    background: radial-gradient(circle .3em at 30% 11.5%,var(--bg-cat) 100%,transparent 0),radial-gradient(circle 1.65em at 50% 50%,var(--bg-color) 100%,transparent 0),conic-gradient(transparent 152deg,var(--bg-cat) 152deg 330deg,transparent 330deg);
                    z-index: -1
                }
                
                .sock {
                    --bg-color: #F8A11E;
                    --line-color: #EE6D02;
                    --x: 0;
                    --y: 0;
                    --deg: 0;
                    width: 2.25em;
                    height: 3em;
                    transform: rotate(var(--deg)) translate(var(--x),var(--y));
                    z-index: 5
                }
                
                .sock::before {
                    width: 1.15em;
                    height: 1.925em;
                    content: "";
                    border-radius: .1em .1em 0 .1em;
                    background: linear-gradient(var(--bg-color) 25%,var(--line-color) 25%,var(--line-color) 35%,var(--bg-color) 35%,var(--bg-color) 45%,var(--line-color) 45%)
                }
                
                .sock::after {
                    width: 1.15em;
                    height: 1.75em;
                    content: "";
                    background: radial-gradient(circle .55em at 50% 100%,var(--bg-color) 100%,transparent 0),var(--line-color);
                    bottom: -0.2em;
                    border-radius: .1em 0 1em 1em;
                    transform-origin: center top;
                    transform: rotate(-45deg) translateX(-0.15em)
                }
                
                .sock.orange {
                    --deg: 60deg;
                    bottom: -0.35em;
                    left: 5em;
                    animation: sock-falling var(--time,2500ms) var(--delay,0ms) infinite ease
                }
                
                .sock.orange::after {
                    transform: rotate(-45deg) translate(-0.15em,-0.1em)
                }
                
                @keyframes sock-falling {
                    50% {
                        bottom: 10em
                    }
                
                    70%,73% {
                        transform: rotate(60deg);
                        left: 4.75em;
                        bottom: 5em
                    }
                
                    80% {
                        transform: rotate(20deg)
                    }
                
                    100% {
                        bottom: 0;
                        transform: rotate(-80deg)
                    }
                }
                
                .sock.green {
                    --bg-color: #387D45;
                    --line-color: #4BB15F;
                    --deg: 120deg;
                    bottom: -0.15em;
                    left: 2.5em
                }
                
                .sock.red {
                    --bg-color: #EE6B77;
                    --line-color: #EA3949;
                    --deg: 45deg;
                    bottom: 0;
                    left: 1.5em
                }
                
                .bubbles {
                    width: 4em;
                    height: 1em;
                    transform: translateX(-50%);
                    bottom: 0;
                    z-index: 5;
                    left: 45%
                }
                
                .bubbles .bubble {
                    width: var(--size);
                    height: var(--size);
                    border-radius: 50%;
                    background-color: #fff;
                    animation: bounce-bubble var(--time,2500ms) var(--delay,0ms) infinite ease
                }
                
                @keyframes bounce-bubble {
                    0%,15%,25%,40% {
                        transform: translateY(0)
                    }
                
                    10%,35% {
                        transform: translateY(var(--bounce))
                    }
                
                    20% {
                        transform: translateY(var(--bounce))
                    }
                }
                
                .bubbles .bubble:nth-of-type(1) {
                    --bounce: -1.6em;
                    --bounce-two: -1.8em;
                    --size: .5em;
                    --delay: 13ms;
                    left: 93%
                }
                
                .bubbles .bubble:nth-of-type(2) {
                    --bounce: -1.9em;
                    --bounce-two: -1.7em;
                    --size: .7em;
                    --delay: 26ms;
                    left: 7%
                }
                
                .bubbles .bubble:nth-of-type(3) {
                    --bounce: -1.9em;
                    --bounce-two: -2em;
                    --size: .9em;
                    --delay: 39ms;
                    left: 94%
                }
                
                .bubbles .bubble:nth-of-type(4) {
                    --bounce: -2em;
                    --bounce-two: -1.7em;
                    --size: .9em;
                    --delay: 52ms;
                    left: 43%
                }
                
                .bubbles .bubble:nth-of-type(5) {
                    --bounce: -1.8em;
                    --bounce-two: -1.7em;
                    --size: .7em;
                    --delay: 65ms;
                    left: 77%
                }
                
                .bubbles .bubble:nth-of-type(6) {
                    --bounce: -1em;
                    --bounce-two: -1.3em;
                    --size: .9em;
                    --delay: 78ms;
                    left: 94%
                }
                
                .bubbles .bubble:nth-of-type(7) {
                    --bounce: -1.9em;
                    --bounce-two: -1.8em;
                    --size: .5em;
                    --delay: 91ms;
                    left: 14%
                }
                
                .bubbles .bubble:nth-of-type(8) {
                    --bounce: -1.3em;
                    --bounce-two: -1.9em;
                    --size: .9em;
                    --delay: 104ms;
                    left: 7%
                }
                
                .bubbles .bubble:nth-of-type(9) {
                    --bounce: -1.2em;
                    --bounce-two: -1.8em;
                    --size: .9em;
                    --delay: 117ms;
                    left: 66%
                }
                
                .bubbles .bubble:nth-of-type(10) {
                    --bounce: -1.3em;
                    --bounce-two: -1.4em;
                    --size: .8em;
                    --delay: 130ms;
                    left: 66%
                }
                
                .bubbles .bubble:nth-of-type(11) {
                    --bounce: -1.8em;
                    --bounce-two: -1.4em;
                    --size: .6em;
                    --delay: 143ms;
                    left: 52%
                }
                
                .bubbles .bubble:nth-of-type(12) {
                    --bounce: -1.5em;
                    --bounce-two: -1.6em;
                    --size: .9em;
                    --delay: 156ms;
                    left: 43%
                }
                
                .bubbles .bubble:nth-of-type(13) {
                    --bounce: -1em;
                    --bounce-two: -1.8em;
                    --size: .9em;
                    --delay: 169ms;
                    left: 29%
                }
                
                .bubbles .bubble:nth-of-type(14) {
                    --bounce: -1.9em;
                    --bounce-two: -1.4em;
                    --size: .9em;
                    --delay: 182ms;
                    left: 84%
                }
                
                .bubbles .bubble:nth-of-type(15) {
                    --bounce: -1.4em;
                    --bounce-two: -1.6em;
                    --size: .5em;
                    --delay: 195ms;
                    left: 94%
                }
                
                .bubbles .bubble:nth-of-type(16) {
                    --bounce: -1.1em;
                    --bounce-two: -1.1em;
                    --size: .6em;
                    --delay: 208ms;
                    left: 19%
                }
                
                .bubbles .bubble:nth-of-type(17) {
                    --bounce: -1.5em;
                    --bounce-two: -1.1em;
                    --size: .6em;
                    --delay: 221ms;
                    left: 20%
                }
                
                .bubbles .bubble:nth-of-type(18) {
                    --bounce: -1.7em;
                    --bounce-two: -1em;
                    --size: .6em;
                    --delay: 234ms;
                    left: 92%
                }
                
                .bubbles .bubble:nth-of-type(19) {
                    --bounce: -1.6em;
                    --bounce-two: -1.2em;
                    --size: .8em;
                    --delay: 247ms;
                    left: 99%
                }
                
                .bubbles .bubble:nth-of-type(20) {
                    --bounce: -2em;
                    --bounce-two: -1.2em;
                    --size: .5em;
                    --delay: 260ms;
                    left: 15%
                }
                
                img {
                    display: none
                }
                
                .dedication {
                    color: white;
                    font-family: sans-serif;
                    bottom: 1rem;
                    text-decoration: none
                }
                
                .twitter-button * {
                    position: initial
                }
            </style>
        `,
      };
    },
  });
  </script>
  
  <style>
  /* 父组件的样式 */
  .abdsos {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    padding: 20px;
    width: 100%;
    min-width: 100%;
    min-height: 300px;
    height: auto;
    font-family: Arial, sans-serif;
    border: 2px solid var(--vp-c-brand-3);
    border-radius: 15px;
  }
  </style>
  