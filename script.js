/*
    Alejandro Alvarez Porras       100768077
    All the logic to make the tamagotchi character work.
*/

class Tamogotchi {
    constructor(tamoName, data, svgCharacter, scoreTarget) {
        this.petName = tamoName;
        this.data = data;
        this.svg = svgCharacter;
        this.initialFood = 60;
        this.metabolismRate = 1000;
        this.score = scoreTarget;
        this.started = false;

        this.armLeft = this.svg.getElementById("Arm-left");
        this.armRight = this.svg.getElementById("Arm-right");
        this.leftEar = this.svg.getElementById("Left-ear");
        this.rightEar = this.svg.getElementById("Right-ear");
        this.mouth = this.svg.getElementById("mouth");
        this.allEyeLeft = this.svg.getElementById("eye-left");
        this.eyeLeft = this.svg.getElementById("eye");
        this.pupilLeft = this.svg.getElementById("pupil");
        this.eyebrowLeft = this.svg.getElementById("eyebrow");
        this.allEyeRight = this.svg.getElementById("eye-right");
        this.eyeRight = this.svg.getElementById("eye-2");
        this.pupilRight = this.svg.getElementById("pupil-2");
        this.eyebrowRight = this.svg.getElementById("eyebrow-2");
        this.laughEyeLeft = this.svg.getElementById("laughEye");
        this.laughEyeRight = this.svg.getElementById("laughEye-2");
        this.deadEyeLeft = this.svg.getElementById("deadEye");
        this.deadEyeRight= this.svg.getElementById("deadEye-2");

        this.previousEyes = [this.eyeRight, this.pupilRight, this.eyeLeft, this.pupilLeft];
        this.laughEyes = [this.laughEyeLeft, this.laughEyeRight];
        this.deadEyes = [this.deadEyeLeft, this.deadEyeRight];

        gsap.set(this.armRight, {
            transformOrigin: "top center"
        })
        gsap.set(this.armLeft, {
            transformOrigin: "top center"
        })
        gsap.set(this.previousEyes, {
            visibility: "visible"
        })
        gsap.set(this.laughEyes, {
            visibility: "hidden"
        })
        gsap.set(this.deadEyes, {
            visibility: "hidden"
        })
    }

    init() {
        console.log(`Hi!  I'm ${this.petName}`);
        fetch(this.data)
            .then(response => response.json())
            .then(data => {
                this.personalityTraits = data.personality;
                this.compliments = data.compliments;
                this.foodList = data.foods;
                this.started = true;
                console.log(this.foodList);
                this.hatch();
            })
            .catch(err => console.log(err));
    }

    resetFood() {
        this.food = this.initialFood;
    }
    hatch() {
        this.resetFood();
        this.startMetabolism();
    }
    die() {
        clearInterval(this.metabolism);
        console.log("I am dead!");
        gsap.set(this.previousEyes, {
            visibility: "hidden"
        })
        gsap.set(this.laughEyes, {
            visibility: "hidden"
        })
        gsap.set(this.deadEyes, {
            visibility: "visible"
        })
    }
    changeMetabolism(newMetabolism) {
        clearInterval(this.metabolism);
        this.metabolismRate = newMetabolism;
        this.startMetabolism();
    }
    startMetabolism() {
        clearInterval(this.metabolism);
        this.metabolism = setInterval(() => {
            this.food -= 1;
            this.score.innerHTML = this.food;
            console.log(`${this.food} until I starve`);
            if (this.food <= 0) {
                this.die();
            }
        }, this.metabolismRate);
    }
    eatLasagna() {
        console.log(`can I see the food? ${this.food}`);
        this.food += 20;
    }
    eatRandomFood(target) {
        console.log(this.foodList);
        let randomFood = this.foodList[Math.floor(Math.random() * this.foodList.length)];
        let isPoisoned = () => {
            let threshold = Math.random();
            return randomFood.poisonChance <= threshold ? true : false;
        }
        if (isPoisoned()) {
            this.food -= randomFood.foodPoints;
            if(this.food <= 0){
                this.die();
            }else{
                blede.animateSad();
                setTimeout(function(){
                    blede.animateTalk();
                    target.innerHTML = "I don't feel so good"
                    setTimeout(function(){
                        blede.animateTalkStop();
                        blede.animateNeutral()
                    })
                }, 1000)
            }
        } else {
            this.food += randomFood.foodPoints;
            blede.animateHappy();
            setTimeout(function(){
                blede.animateTalk();
                target.innerHTML = "That was great food!"
                setTimeout(function(){
                    blede.animateTalkStop();
                    blede.animateNeutral()
                })
            }, 1000)

        }
        // console.log(randomFood);
        // console.log(`I'm going to eat ${randomFood.name}`);
        // this.food += randomFood.foodPoints;
    }

    increaseMetabolism() {
        this.changeMetabolism(this.metabolismRate + 200)
    }

    decreaseMetabolism() {
        if(this.metabolismRate <= 0){
            this.die()
        }else{
            this.changeMetabolism(this.metabolismRate - 200)
        }
    }
    complimentUser(target, username) {
        let randomCompliment = this.compliments[Math.floor(Math.random() * this.compliments.length)];
        if (username == "" || username == undefined || username == null) {
            username = "User"
        }
        if(this.started == true){
            target.innerHTML = randomCompliment.replace("<user>", username);
        }
    }
    animateNeutral() {
        gsap.to(leftEar, {
            x: 0,
            y: 0
        });
        gsap.to(rightEar, {
            x: 0,
            y: 0
        });
        gsap.to(mouth, {
            attr: {
                d: "M316.82,408.09 Q380,408.09 434.43,408.09 M316.82,408.09 Q380,408.09 434.43,408.09",
            },
            y: 0
        });
        gsap.to([eyeLeft, eyeRight], {
            attr: {
                width: "42.44",
                height: "148.85"
            },
            y: 0
        })
        gsap.to([pupilLeft, pupilRight], {
            attr: {
                width: "48.44",
                height: "92.85"
            },
            y: 0
        })

        gsap.to(armLeft, {
            rotate: 0
        })

        gsap.to(armRight, {
            rotate: 0
        })
        gsap.to(eyebrowLeft, {
            attr: {
                d: "M315,298.85 C315,228.85 413,228.85 413,298.85"
            },
            y: -57.89
        })
        gsap.to(eyebrowRight, {
            attr: {
                d: "M553.29,298.85 C553.29,228.85 651.29,228.85 651.29,298.85"
            },
            y: -57.89
        })
        gsap.set(previousEyes, {
            visibility: "visible"
        })
        gsap.set(laughEyes, {
            visibility: "hidden"
        })
    }

    animateHappy() {
        gsap.to(leftEar, {
            x: -40,
            y: 0
        });
        gsap.to(rightEar, {
            x: 40,
            y: 0
        });
        gsap.set(mouth, {
            transformOrigin: "center center"
        })
        gsap.to(mouth, {
            attr: {
                d: "M316.82,408.09 Q380,458.09 434.43,408.09 M316.82,408.09 Q380,458.09 434.43,408.09",
            },
            y: 0
        });
        gsap.to([eyeLeft, eyeRight], {
            attr: {
                width: "42.44",
                height: "125.45"
            },
            y: 40
        })
        gsap.to([pupilLeft, pupilRight], {
            attr: {
                width: "48.44",
                height: "68.85"
            },
            y: 30
        })

        gsap.to(armLeft, {
            rotate: 20
        })

        gsap.to(armRight, {
            rotate: -20
        })
        gsap.to(eyebrowLeft, {
            attr: {
                d: "M315,298.85 C315,228.85 413,228.85 413,298.85"
            },
            y: -125.46
        })
        gsap.to(eyebrowRight, {
            attr: {
                d: "M553.29,298.85 C553.29,228.85 651.29,228.85 651.29,298.85"
            },
            y: -125.46
        })
        gsap.set(previousEyes, {
            visibility: "visible"
        })
        gsap.set(laughEyes, {
            visibility: "hidden"
        })
    }

    animateSad() {
        gsap.to(leftEar, {
            x: 0,
            y: 40
        });
        gsap.to(rightEar, {
            x: 0,
            y: 40
        });
        gsap.to(mouth, {
            attr: {
                d: "M316.82,408.09 Q380,358.09 434.43,408.09 M316.82,408.09 Q380,358.09 434.43,408.09",
            },
            y: 40
        });
        gsap.to([eyeLeft, eyeRight], {
            attr: {
                width: "42.44",
                height: "108.85"
            },
            y: 50
        })
        gsap.to([pupilLeft, pupilRight], {
            attr: {
                width: "48.44",
                height: "56.85"
            },
            y: 40
        })

        gsap.to(armLeft, {
            rotate: -10
        })

        gsap.to(armRight, {
            rotate: 10
        })
        gsap.to(eyebrowLeft, {
            attr: {
                d: "M315,288.85 C325,228.85 370,228.85 410,233.85"
            },
            y: 0
        })
        gsap.to(eyebrowRight, {
            attr: {
                d: "M553.29,233.85 C596.29,228.85 641.29,228.85 651.29,298.85"
            },
            y: 0
        })
        gsap.set(previousEyes, {
            visibility: "visible"
        })
        gsap.set(laughEyes, {
            visibility: "hidden"
        })
    }

    animateAngry() {
        gsap.to(leftEar, {
            x: 0,
            y: 40
        });
        gsap.to(rightEar, {
            x: 0,
            y: 40
        });
        gsap.to(mouth, {
            attr: {
                d: "M316.82,408.09 Q380,358.09 434.43,408.09 M316.82,408.09 Q380,358.09 434.43,408.09",
            },
            y: 40
        });
        gsap.to([eyeLeft, eyeRight], {
            attr: {
                width: "42.44",
                height: "108.85"
            },
            y: 50
        })
        gsap.to([pupilLeft, pupilRight], {
            attr: {
                width: "48.44",
                height: "56.85"
            },
            y: 40
        })

        gsap.to(armLeft, {
            rotate: -10
        })

        gsap.to(armRight, {
            rotate: 10
        })
        gsap.to(eyebrowLeft, {
            attr: {
                d: "M315,288.85 C325,228.85 370,228.85 410,233.85"
            },
            y: 0
        })
        gsap.to(eyebrowRight, {
            attr: {
                d: "M553.29,233.85 C596.29,228.85 641.29,228.85 651.29,298.85"
            },
            y: 0
        })
        gsap.set(previousEyes, {
            visibility: "visible"
        })
        gsap.set(laughEyes, {
            visibility: "hidden"
        })
    }

    animateJokey(){
        gsap.to(leftEar, {
            x: -60,
            y: 0
        });
        gsap.to(rightEar, {
            x: 60,
            y: 0
        });
        gsap.to(mouth, {
            attr: {
                d: "M256.82,408.09 Q380,408.09 484.43,408.09 M256.82,408.09 Q380,548.09 484.43,408.09 ",
            },
            y: 0
        });
        gsap.to([eyeLeft, eyeRight], {
            attr: {
                width: "42.44",
                height: "148.85"
            },
            y: 0
        })
        gsap.to([pupilLeft, pupilRight], {
            attr: {
                width: "48.44",
                height: "92.85"
            },
            y: 0
        })

        gsap.to(armLeft, {
            rotate: 40
        })

        gsap.to(armRight, {
            rotate: -40
        })
        gsap.to(eyebrowLeft, {
            attr: {
                d: "M295,298.85 C335,298.85 363,278.85 383,258.85"
            },
            y: -57.89
        })
        gsap.to(eyebrowRight, {
            attr: {
                d: "M583.29,258.85 C603.29,278.85 631.29,298.85 671.29,298.85"
            },
            y: -57.89
        })
        gsap.set(previousEyes, {
            visibility: "hidden"
        })
        gsap.set(laughEyes, {
            visibility: "visible"
        })
        gsap.from(laughEyes, {
            y: 20
        })
    }

    animateTalk(){
        gsap.to(this.mouth, {
            attr: {
                d: "M316.82,408.09 Q380,368.09 434.43,408.09 M316.82,408.09 Q380,448.09 434.43,408.09"
            },
            duration: 0.3,
            yoyo: true
        })
    }

    animateTalkStop(){
        gsap.to(this.mouth, {
            attr:{
                d: "M316.82,408.09 Q380,408.09 434.43,408.09 M316.82,408.09 Q380,408.09 434.43,408.09"
            }
        })
    }
}







window.onload = function () {

    // reference the embedded svg
    let character = document.getElementById('character').contentDocument;
    // reference specific target inside svg file
    let blede = new Tamogotchi("blede", "data.json", character, document.getElementById("foodCount"));
    let textBox = document.querySelector("#textBox p");

    document.getElementById("start").addEventListener("click", function(){
        if(blede.started == false){
            blede.init();
        }else{
            textBox.innerHTML = "The game has already started, click the restart button to restart the game."
        }
    })

    document.getElementById("stop").addEventListener("click", function(){
        if(blede.started == true){
            blede.hatch();
        }else{
            textBox.innerHTML = "The game has not started yet! Click the play button to start."
        }
    })

    document.getElementById("compliment").addEventListener("click", function(){
        blede.animateHappy();
        setTimeout(function(){
            blede.animateTalk();
            blede.complimentUser(textBox, document.getElementById("username").value);
            setTimeout(function(){
                blede.animateTalkStop();
                blede.animateNeutral()
            })
        }, 1000)
    })

    document.getElementById("eatRandomFood").addEventListener("click", function(){
        blede.eatRandomFood(textBox)
    })

    document.getElementById("speedMetabolism").addEventListener("click", function(){
        blede.increaseMetabolism();
        textBox.innerHTML = `Metabolism increased to ${(blede.metabolismRate)/1000}`
    })

    document.getElementById("happy").addEventListener("click",function(){
        blede.animateHappy();
        setTimeout(function(){
            blede.animateTalk();
            let happyTraits = blede.personalityTraits.filter(function(filter){
                return filter.mood === "Happy";
            })
            let happyText = happyTraits[Math.floor(Math.random() * happyTraits.length)];
            textBox.innerHTML = happyText;
            setTimeout(function(){
                blede.animateTalkStop();
                blede.animateNeutral()
            })
        }, 1000)
    })


    document.getElementById("sad").addEventListener("click",function(){
        blede.animateSad();
        setTimeout(function(){
            blede.animateTalk();
            let sadTraits = blede.personalityTraits.filter(function(filter){
                return filter.mood === "Sad";
            })
            let sadText = sadTraits[Math.floor(Math.random() * happyTraits.length)];
            textBox.innerHTML = sadText;
            setTimeout(function(){
                blede.animateTalkStop();
                blede.animateNeutral()
            })
        }, 1000)
    })


    document.getElementById("angry").addEventListener("click",function(){
        blede.animateAngry();
        setTimeout(function(){
            blede.animateTalk();
            let angryTraits = blede.personalityTraits.filter(function(filter){
                return filter.mood === "Angry";
            })
            let angryText = angryTraits[Math.floor(Math.random() * happyTraits.length)];
            textBox.innerHTML = angryText;
            setTimeout(function(){
                blede.animateTalkStop();
                blede.animateNeutral()
            })
        }, 1000)
    })

    
    document.getElementById("joke").addEventListener("click",function(){
        blede.animateJokey();
        setTimeout(function(){
            blede.animateTalk();
            let jokeyTraits = blede.personalityTraits.filter(function(filter){
                return filter.mood === "Jokey";
            })
            let jokeyText = jokeyTraits[Math.floor(Math.random() * happyTraits.length)];
            textBox.innerHTML = jokeyText;
            setTimeout(function(){
                blede.animateTalkStop();
                blede.animateNeutral()
            })
        }, 1000)
    })

    // let btn1 = document.getElementById('btn1').contentDocument;
    // let btn2 = document.getElementById('btn2').contentDocument;
    // let btn3 = document.getElementById('btn3').contentDocument;
    // let btn4 = document.getElementById('btn4').contentDocument;
    // let btn5 = document.getElementById('btn5').contentDocument;
    // // reference specific target
    // let b0 = btn1.getElementById("Neutral");
    // let b1 = btn2.getElementById("Happy");
    // let b2 = btn3.getElementById("Sad");
    // let b3 = btn4.getElementById("Laugh");
    // let b4 = btn5.getElementById("Angry");

    // let arrayOfBtn = [b0, b1, b2, b3, b4];
    // console.log(arrayOfBtn)
    // gsap.set(arrayOfBtn, {
    //     autoAlpha: 1
    // })

    // let hoverBtns = document.getElementsByClassName('btnStyle');
    // gsap.utils.toArray(hoverBtns).forEach((btn) => {
    //     let hovering = gsap.to(btn, {
    //         transformOrigin: "center center",
    //         scale: 0.8,
    //         paused: true
    //     })

    //     btn.addEventListener("mouseenter", () => {
    //         hovering.play();
    //     })

    //     btn.addEventListener("mouseleave", () => {
    //         hovering.reverse();
    //     })
    // })

    //Set up body parts
    // let armLeft = character.getElementById("Arm-left");
    // let armRight = character.getElementById("Arm-right");
    // let leftEar = character.getElementById("Left-ear");
    // let rightEar = character.getElementById("Right-ear");
    // let mouth = character.getElementById("mouth");
    // let allEyeLeft = character.getElementById("eye-left");
    // let eyeLeft = character.getElementById("eye");
    // let pupilLeft = character.getElementById("pupil");
    // let eyebrowLeft = character.getElementById("eyebrow");
    // let allEyeRight = character.getElementById("eye-right");
    // let eyeRight = character.getElementById("eye-2");
    // let pupilRight = character.getElementById("pupil-2");
    // let eyebrowRight = character.getElementById("eyebrow-2");
    // let laughEyeLeft = character.getElementById("laughEye");
    // let laughEyeRight = character.getElementById("laughEye-2");

    // let previousEyes = [eyeRight, pupilRight, eyeLeft, pupilLeft];
    // let laughEyes = [laughEyeLeft, laughEyeRight];


    // gsap.set(armRight, {
    //     transformOrigin: "top center"
    // })
    // gsap.set(armLeft, {
    //     transformOrigin: "top center"
    // })
    // gsap.set(previousEyes, {
    //     visibility: "visible"
    // })
    // gsap.set(laughEyes, {
    //     visibility: "hidden"
    // })

    // //Click events
    // btn1.addEventListener("click", function () {
    //     console.log("Neutral");
    //     gsap.to(leftEar, {
    //         x: 0,
    //         y: 0
    //     });
    //     gsap.to(rightEar, {
    //         x: 0,
    //         y: 0
    //     });
    //     gsap.to(mouth, {
    //         attr: {
    //             d: "M316.82,408.09 Q380,408.09 434.43,408.09 M316.82,408.09 Q380,408.09 434.43,408.09",
    //         },
    //         y: 0
    //     });
    //     gsap.to([eyeLeft, eyeRight], {
    //         attr: {
    //             width: "42.44",
    //             height: "148.85"
    //         },
    //         y: 0
    //     })
    //     gsap.to([pupilLeft, pupilRight], {
    //         attr: {
    //             width: "48.44",
    //             height: "92.85"
    //         },
    //         y: 0
    //     })

    //     gsap.to(armLeft, {
    //         rotate: 0
    //     })

    //     gsap.to(armRight, {
    //         rotate: 0
    //     })
    //     gsap.to(eyebrowLeft, {
    //         attr: {
    //             d: "M315,298.85 C315,228.85 413,228.85 413,298.85"
    //         },
    //         y: -57.89
    //     })
    //     gsap.to(eyebrowRight, {
    //         attr: {
    //             d: "M553.29,298.85 C553.29,228.85 651.29,228.85 651.29,298.85"
    //         },
    //         y: -57.89
    //     })
    //     gsap.set(previousEyes, {
    //         visibility: "visible"
    //     })
    //     gsap.set(laughEyes, {
    //         visibility: "hidden"
    //     })

    // });
    // btn2.addEventListener("click", function () {
    //     console.log("Happy");
    //     gsap.to(leftEar, {
    //         x: -40,
    //         y: 0
    //     });
    //     gsap.to(rightEar, {
    //         x: 40,
    //         y: 0
    //     });
    //     gsap.set(mouth, {
    //         transformOrigin: "center center"
    //     })
    //     gsap.to(mouth, {
    //         attr: {
    //             d: "M316.82,408.09 Q380,458.09 434.43,408.09 M316.82,408.09 Q380,458.09 434.43,408.09",
    //         },
    //         y: 0
    //     });
    //     gsap.to([eyeLeft, eyeRight], {
    //         attr: {
    //             width: "42.44",
    //             height: "125.45"
    //         },
    //         y: 40
    //     })
    //     gsap.to([pupilLeft, pupilRight], {
    //         attr: {
    //             width: "48.44",
    //             height: "68.85"
    //         },
    //         y: 30
    //     })

    //     gsap.to(armLeft, {
    //         rotate: 20
    //     })

    //     gsap.to(armRight, {
    //         rotate: -20
    //     })
    //     gsap.to(eyebrowLeft, {
    //         attr: {
    //             d: "M315,298.85 C315,228.85 413,228.85 413,298.85"
    //         },
    //         y: -125.46
    //     })
    //     gsap.to(eyebrowRight, {
    //         attr: {
    //             d: "M553.29,298.85 C553.29,228.85 651.29,228.85 651.29,298.85"
    //         },
    //         y: -125.46
    //     })
    //     gsap.set(previousEyes, {
    //         visibility: "visible"
    //     })
    //     gsap.set(laughEyes, {
    //         visibility: "hidden"
    //     })
    // });
    // btn3.addEventListener("click", function () {
    //     console.log("Sad");
    //     gsap.to(leftEar, {
    //         x: 0,
    //         y: 40
    //     });
    //     gsap.to(rightEar, {
    //         x: 0,
    //         y: 40
    //     });
    //     gsap.to(mouth, {
    //         attr: {
    //             d: "M316.82,408.09 Q380,358.09 434.43,408.09 M316.82,408.09 Q380,358.09 434.43,408.09",
    //         },
    //         y: 40
    //     });
    //     gsap.to([eyeLeft, eyeRight], {
    //         attr: {
    //             width: "42.44",
    //             height: "108.85"
    //         },
    //         y: 50
    //     })
    //     gsap.to([pupilLeft, pupilRight], {
    //         attr: {
    //             width: "48.44",
    //             height: "56.85"
    //         },
    //         y: 40
    //     })

    //     gsap.to(armLeft, {
    //         rotate: -10
    //     })

    //     gsap.to(armRight, {
    //         rotate: 10
    //     })
    //     gsap.to(eyebrowLeft, {
    //         attr: {
    //             d: "M315,288.85 C325,228.85 370,228.85 410,233.85"
    //         },
    //         y: 0
    //     })
    //     gsap.to(eyebrowRight, {
    //         attr: {
    //             d: "M553.29,233.85 C596.29,228.85 641.29,228.85 651.29,298.85"
    //         },
    //         y: 0
    //     })
    //     gsap.set(previousEyes, {
    //         visibility: "visible"
    //     })
    //     gsap.set(laughEyes, {
    //         visibility: "hidden"
    //     })
    // });


    // btn4.addEventListener("click", function () {
    //     console.log("Laugh");
    //     gsap.to(leftEar, {
    //         x: -60,
    //         y: 0
    //     });
    //     gsap.to(rightEar, {
    //         x: 60,
    //         y: 0
    //     });
    //     gsap.to(mouth, {
    //         attr: {
    //             d: "M256.82,408.09 Q380,408.09 484.43,408.09 M256.82,408.09 Q380,548.09 484.43,408.09 ",
    //         },
    //         y: 0
    //     });
    //     gsap.to([eyeLeft, eyeRight], {
    //         attr: {
    //             width: "42.44",
    //             height: "148.85"
    //         },
    //         y: 0
    //     })
    //     gsap.to([pupilLeft, pupilRight], {
    //         attr: {
    //             width: "48.44",
    //             height: "92.85"
    //         },
    //         y: 0
    //     })

    //     gsap.to(armLeft, {
    //         rotate: 40
    //     })

    //     gsap.to(armRight, {
    //         rotate: -40
    //     })
    //     gsap.to(eyebrowLeft, {
    //         attr: {
    //             d: "M295,298.85 C335,298.85 363,278.85 383,258.85"
    //         },
    //         y: -57.89
    //     })
    //     gsap.to(eyebrowRight, {
    //         attr: {
    //             d: "M583.29,258.85 C603.29,278.85 631.29,298.85 671.29,298.85"
    //         },
    //         y: -57.89
    //     })
    //     gsap.set(previousEyes, {
    //         visibility: "hidden"
    //     })
    //     gsap.set(laughEyes, {
    //         visibility: "visible"
    //     })
    //     gsap.from(laughEyes, {
    //         y: 20
    //     })
    // });


    // btn5.addEventListener("click", function () {
    //     console.log("Angry");
    //     gsap.to(leftEar, {
    //         x: 0,
    //         y: 50
    //     });
    //     gsap.to(rightEar, {
    //         x: 0,
    //         y: 50
    //     });
    //     gsap.to(mouth, {
    //         attr: {
    //             d: "M336.82,408.09 Q380,398.09 414.43,408.09 M336.82,408.09 Q380,398.09 414.43,408.09",
    //         },
    //         y: 0
    //     });
    //     gsap.to([eyeLeft, eyeRight], {
    //         attr: {
    //             width: "42.44",
    //             height: "98.85"
    //         },
    //         y: 60
    //     })
    //     gsap.to([pupilLeft, pupilRight], {
    //         attr: {
    //             width: "48.44",
    //             height: "56.85"
    //         },
    //         y: 40
    //     })

    //     gsap.to(armLeft, {
    //         rotate: 20
    //     })

    //     gsap.to(armRight, {
    //         rotate: -20
    //     })
    //     gsap.to(eyebrowLeft, {
    //         attr: {
    //             d: "M315,240.85 C325,260.85 380,308.85 440,298.85"
    //         },
    //         y: -37.89
    //     })
    //     gsap.to(eyebrowRight, {
    //         attr: {
    //             d: "M526.29,298.85 C586.29,308.85 641.29,260.85 651.29,240.85"
    //         },
    //         y: -37.89
    //     })
    //     gsap.set(previousEyes, {
    //         visibility: "visible"
    //     })
    //     gsap.set(laughEyes, {
    //         visibility: "hidden"
    //     })
    // });
}