import * as fight from '../../code/fight.js';
import { addLine } from '../../../components/Fight.svelte';

export let monsters = {
    /*blugam: {
        name: "Blugam",
        statistics: {
            HP: 1100,
            STR: 350,
            ARM: 40,
            speed: 30,
            CritChance: 0.2,
            CritDamage: 1.5
        },
        states: {
            stuned: false,
            bleeding: false,
            bleedingDuration: 0,
            bleedingStacks: 0,
            poisoned: false,
            sanguineOffering: false,
        },
        spells: {
            1: {
                name: "Toxic Mist",
                description: "2% max health per turn",
                castChance: 0.05,
                cooldown: 5,
                currentCooldown: 0,
            },
        },
        // skin: "blugam",
    },*/
    shadowbeak: {
        name: "Shadowbeak",
        image: "./src/assets/art/characters/monsters/boss/shadowbeak.png",
        statistics: {
            HP: 2000,
            maxHP: 2000,
            STR: 275,
            ARM: 30,
            speed: 36,
            CritChance: 0.3,
            CritDamage: 1.2
        },
        selfAttributes: {
            Static: 0,
        },
        passives: {
            perTurn(target, self) { // fonction exécutée au début du tour du personnage, gère les passifs du personnage
            },
            onHit(target, self) { // fonction exécutée dès que le personnage prends un coups, gère les réactions à ce dernier
                self.selfAttributes.Static++;
                
                if (self.selfAttributes.Static >= 5) {
                    target.negativeEffects.stun.state = true;
                    target.negativeEffects.stun.duration++;

                    let damage = Math.round((target.statistics.maxHP - target.statistics.HP) * 0.05);
                    target.statistics.HP -= damage;

                    addLine({
                        text: `Static explose et libère un arc électrique qui paralyse ${target.name} et lui inflige ${damage} de dégâts`,
                        styles: 
                            [   
                                { word: `arc`, color: 'yellow'},
                                { word: `électrique`, color: 'yellow'},
                                { word: `paralyse`, color: 'yellow'},
                        ]
                    });

                    self.selfAttributes.Static = 0;
                }
            }
        },
        buffs: {
            1: {
                name: "Sanguine Offering",
                isActive: false,
                isPermanent: true,
                duration: 0,
                applyBuff() {
                    if (this.isPermanent) {
                        return;
                    }

                    this.isActive = true;

                    if (this.isActive) {
                        
                    }
                },
                checkBuff() {
                    if (this.duration > 0) {
                        this.duration --;
                    }

                    if (this.duration === 0) {
                        this.isActive = false;
                        return
                    }
                }
            }
        },
        negativeEffects: {
            bleed: {
                state: false,
                stacks: 0,
                duration: 0,
                damage: 0,
                log(self) {
                    addLine({
                        text: `${self.name} saigne et subit ${this.damage} points de dégats de saignement!`,
                        styles: 
                            [
                                { word: `${this.damage}`, color: 'red'},
                                { word: `saignement`, color: 'red'}
                        ]
                    });
                },
                apply(self) {
                    self.statistics.HP -= this.damage;
                    this.log(self)
                }
            },
            poison: {
                state: false,
                stacks: 0,
                duration: 0,
                damage: 0,
                log(self) {
                    addLine({
                        text: `${self.name} est empoisonné et subit ${this.damage} points de dégats d' empoisonnement!`,
                        styles: 
                            [
                                { word: `${this.damage}`, color: 'purple'},
                                { word: `empoisonnement`, color: 'purple'}
                        ]
                    });
                },
                apply(self) {
                    self.statistics.HP -= this.damage;
                    this.log(self)
                }
            },
            burn: {
                state: false,
                stacks: 0,
                duration: 0,
                damage: 0,
                log(self) {
                    addLine({
                        text: `${self.name} brûle et subit ${this.damage} points de dégats de brûlure!`,
                        styles: 
                            [
                                { word: `${this.damage}`, color: 'orange'},
                                { word: `brûlure`, color: 'orange'}
                        ]
                    });
                },
                apply(self) {
                    self.statistics.HP -= this.damage;
                    this.log(self)
                }
            },
            freeze: {
                state: false,
                stacks: 0,
                duration: 0,
                damage: 0,
                log(self) {
                    addLine({
                        text: `${self.name} est gelé et subit ${this.damage} points de dégats de gel!`,
                        styles: 
                            [
                                { word: `${this.damage}`, color: 'lightblue'},
                                { word: `gel`, color: 'lightblue'}
                        ]
                    });
                },
                apply(self) {
                    self.statistics.HP -= this.damage;
                    this.log(self)
                }
            },
            slow: {
                state: false,
                stacks: 0,
                duration: 0,
                damage: 0,
                log(self) {
                    addLine({
                        text: `${self.name} est ralentit et a du mal à avancer`,
                        styles: 
                            []
                    });
                },
                apply(self) {
                    this.log(self)
                }
            },
            stun: {
                state: false,
                stacks: 0,
                duration: 0,
                damage: 0,
                log(self) {
                    addLine({
                        text: `${self.name} est paralysé et ne peut pas attaquer`,
                        styles: 
                            [
                                { word: `paralysé`, color: 'yellow'}
                        ]
                    });
                },
                apply(self) {
                    this.log(self)
                }
            },
        },
        spells: {
            0: {
                name: "Thunder Strike",
                description: "Stun the target for 2 turn and apply burn",
                castChance: 0.3,
                cooldown: 4,
                currentCooldown: 0,
                damageType: 'physical',
                type: 'enemy',
                log(target, self, damage) {
                    addLine({
                        text: `${self.name} utilise Thunder Strike, brûle et paralyse ${target.name} !`,
                        styles: 
                            [   
                                { word: `Thunder`, color: 'yellow'},
                                { word: `Strike`, color: 'yellow'},
                                { word: `paralyse`, color: 'orange'},
                        ]
                    });
                },
                canUse(caster, target) {
                    return this.currentCooldown === 0
                },
                use(target, self) {
                    let damage;

                    target.negativeEffects.stun.state = true;
                    target.negativeEffects.stun.duration += 2;

                    target.negativeEffects.burn.state = true;
                    target.negativeEffects.burn.duration += 3;
                    target.negativeEffects.burn.damage += 5;
                    
                    this.currentCooldown = this.cooldown;

                    this.log(target, self, damage);
                }
            },
            1: {
                name: "Ionic Deflagration",
                description: "Perform a powerfull blow, deal 25% max HP of the target, apply burn",
                castChance: 0.3,
                cooldown: 8,
                currentCooldown: 0,
                damageType: 'physical',
                type: 'enemy',
                log(target, self, damage) {
                    addLine({
                        text: `${self.name} utilise Ionic Deflagration et déchaîne une puissance dévastatrice sur ${target.name}, inflige ${damage} et applique une brulûre !`,
                        styles: 
                            [   
                                { word: `Ionic`, color: 'yellow'},
                                { word: `Deflagration`, color: 'yellow'},
                                { word: `dévastatrice`, color: 'orange'},
                                { word: `brulûre`, color: 'orange'}
                        ]
                    });
                },
                canUse(caster, target) {
                    return this.currentCooldown === 0;
                },
                use(target, self) {
                    let damage = Math.round(target.statistics.maxHP * 0.25);

                    target.negativeEffects.burn.state = true;
                    target.negativeEffects.burn.duration = 2;
                    target.negativeEffects.burn.damage += 10;

                    target.statistics.HP -= damage;

                    this.currentCooldown = this.cooldown;

                    this.log(target, self, damage);
                }
            },
            2: {
                name: "Hyper Voltage",
                description: "Huge amount of energy circulate into his veins, gain 2% speed permanently",
                castChance: 0.3,
                cooldown: 3,
                currentCooldown: 0,
                damageType: 'physical',
                type: 'self',
                log(target, self, damage) {
                    addLine({
                        text: `${self.name} utilise Hyper Voltage et augmente sa vitesse totale de 2%`,
                        styles: 
                            [   
                                { word: `Hyper`, color: 'yellow'},
                                { word: `Voltage`, color: 'yellow'},
                                { word: `vitesse`, color: 'yellow'},
                                { word: `2%`, color: 'green'}
                        ]
                    });
                },
                canUse(caster, target) {
                    return this.currentCooldown === 0
                },
                use(target, self) {
                    let damage = 0;

                    self.statistics.speed += Math.round((self.statistics.speed * 0.02));

                    this.currentCooldown = this.cooldown;
                    this.log(target, self, damage);
                }
            },
            3: {
                name: "Exsanguinate",
                description: "10% missing health healing, apply 10 dmg per turn bleeding on the caster, stackable. 10 turn duration",
                castChance: 0.3,
                cooldown: 6,
                currentCooldown: 0,
                damageType: 'physical',
                type: 'self',
                log(target, self, healing) {
                    addLine({
                        text: `${self.name} utilise Exsanguinate et se soigne de ${healing} points de vie!, ${self.name} saigne!`,
                        styles: 
                            [   
                                { word: `Exsanguinate`, color: 'red'},
                                { word: `soigne`, color: 'red'},
                                { word: `${healing}`, color: 'green'},
                                { word: `saigne!`, color: 'red'}
                        ]
                    });
                },
                canUse(caster, target) {
                    return (
                        this.currentCooldown === 0 && caster.statistics.hp >= caster.statistics.maxHP
                    );
                },
                use(target, self) {
                    let healing = Math.round((self.statistics.maxHP - self.statistics.HP) * 0.1);

                    self.statistics.HP += healing;

                    this.currentCooldown = this.cooldown;
                    
                    this.log(target, self, healing);
                }
            }
        },
    },
    /*{
        name: "ShadowBeak",
        statistics: {
            HP: 2000,
            STR: 275,
            ARM: 30,
            speed: 30,
            CritChance: 0.3,
            CritDamage: 1.2
        },
        states: {
            stuned: false,
            bleeding: false,
            bleedingDuration: 0,
            bleedingStacks: 0,
            poisoned: false,
            sanguineOffering: false,
        },
        spells: {
            1: {
                name: "Thunder Strike",
                description: "Stun the target for 1 turn",
                castChance: 0.3,
                cooldown: 2,
                currentCooldown: 0,
            },
            2: {
                name: "Ionic Deflagration",
                description: "Perform a powerfull blow, deal 10 + 60% max health of the target",
                castChance: 0.05,
                cooldown: 40,
                currentCooldown: 0,
                damage: 0.6
            },
        },
        // skin: "shadowbeak",
    },*/
    baron: {
        name: "Baron",
        image: "./src/assets/art/characters/monsters/boss/baron.png",
        statistics: {
            HP: 4500,
            maxHP: 4500,
            STR: 240,
            ARM: 50,
            speed: 30,
            CritChance: 0.2,
            CritDamage: 1.5
        },
        selfAttributes: {
            Souls: 0
        },
        passives: {
            perTurn(target, self) { // fonction exécutée au début du tour du personnage, gère les passifs du personnage
            },
            onHit(target, self) { // fonction exécutée dès que le personnage prends un coups, gère les réactions à ce dernier
            }
        },
        buffs: {
            1: {
                name: "Sanguine Offering",
                isActive: false,
                isPermanent: true,
                duration: 0,
                applyBuff() {
                    if (this.isPermanent) {
                        return;
                    }

                    this.isActive = true;

                    if (this.isActive) {
                        
                    }
                },
                checkBuff() {
                    if (this.duration > 0) {
                        this.duration --;
                    }

                    if (this.duration === 0) {
                        this.isActive = false;
                        return
                    }
                }
            }
        },
        negativeEffects: {
            bleed: {
                state: false,
                stacks: 0,
                duration: 0,
                damage: 0,
                log(self) {
                    addLine({
                        text: `${self.name} saigne et subit ${this.damage} points de dégats de saignement!`,
                        styles: 
                            [
                                { word: `${this.damage}`, color: 'red'},
                                { word: `saignement`, color: 'red'}
                        ]
                    });
                },
                apply(self) {
                    self.statistics.HP -= this.damage;
                    this.log(self)
                }
            },
            poison: {
                state: false,
                stacks: 0,
                duration: 0,
                damage: 0,
                log(self) {
                    addLine({
                        text: `${self.name} est empoisonné et subit ${this.damage} points de dégats d' empoisonnement!`,
                        styles: 
                            [
                                { word: `${this.damage}`, color: 'purple'},
                                { word: `empoisonnement`, color: 'purple'}
                        ]
                    });
                },
                apply(self) {
                    self.statistics.HP -= this.damage;
                    this.log(self)
                }
            },
            burn: {
                state: false,
                stacks: 0,
                duration: 0,
                damage: 0,
                log(self) {
                    addLine({
                        text: `${self.name} brûle et subit ${this.damage} points de dégats de brûlure!`,
                        styles: 
                            [
                                { word: `${this.damage}`, color: 'orange'},
                                { word: `brûlure`, color: 'orange'}
                        ]
                    });
                },
                apply(self) {
                    self.statistics.HP -= this.damage;
                    this.log(self)
                }
            },
            freeze: {
                state: false,
                stacks: 0,
                duration: 0,
                damage: 0,
                log(self) {
                    addLine({
                        text: `${self.name} est gelé et subit ${this.damage} points de dégats de gel!`,
                        styles: 
                            [
                                { word: `${this.damage}`, color: 'lightblue'},
                                { word: `gel`, color: 'lightblue'}
                        ]
                    });
                },
                apply(self) {
                    self.statistics.HP -= this.damage;
                    this.log(self)
                }
            },
            slow: {
                state: false,
                stacks: 0,
                duration: 0,
                damage: 0,
            },
            stun: {
                state: false,
                stacks: 0,
                duration: 0,
                damage: 0,
            },
        },
        spells: {
            0: {
                name: "Profane Rake",
                description: "Perform a huge claw attack on the target, dealing damage, apply bleeding, 2 per turn, stackable, 3 turn duration.",
                castChance: 0.3,
                cooldown: 2,
                currentCooldown: 0,
                damageType: 'physical',
                type: 'enemy',
                log(target, self, damage) {
                    addLine({
                        text: `${self.name} utilise Profane Rake et griffe ${target.name}, inflige ${damage} et applique un saignement! `,
                        styles: 
                            [   
                                { word: `Profane`, color: 'red'},
                                { word: `Rake`, color: 'red'},
                                { word: `${damage}`, color: 'red'},
                                { word: `saignement`, color: 'red'}
                        ]
                    });
                },
                canUse(caster, target) {
                    return this.currentCooldown === 0;
                },
                use(target, self) {
                    let damage = Math.round(fight.calculateDamage(self.statistics.STR, target.statistics.ARM) * 1.2);

                    target.negativeEffects.bleed.state = true;
                    target.negativeEffects.bleed.duration = 3;
                    target.negativeEffects.bleed.damage += 2;

                    target.statistics.HP -= damage;

                    this.currentCooldown = this.cooldown;

                    this.log(target, self, damage);
                }
            },
            1: {
                name: "Sanguine Bite",
                description: "Bite the target, 10 dmg, apply bleeding, 5 dmg per turn, stackable. 3 turn duration",
                castChance: 0.3,
                cooldown: 2,
                currentCooldown: 0,
                damageType: 'physical',
                type: 'enemy',
                log(target, self, damage) {
                    addLine({
                        text: `${self.name} utilise Sanguine Bite et mord ${target.name}, inflige ${damage} et applique un saignement!`,
                        styles: 
                            [   
                                { word: `Sanguine`, color: 'red'},
                                { word: `Bite`, color: 'red'},
                                { word: `${damage}`, color: 'red'},
                                { word: `saignement`, color: 'red'}
                        ]
                    });
                },
                canUse(caster, target) {
                    return this.currentCooldown === 0;
                },
                use(target, self) {
                    let damage = Math.round(fight.calculateDamage(self.statistics.STR, target.statistics.ARM) / 4);

                    target.negativeEffects.bleed.state = true;
                    target.negativeEffects.bleed.duration = 3;
                    target.negativeEffects.bleed.damage += 3;

                    target.statistics.HP -= damage;

                    this.currentCooldown = this.cooldown;

                    this.log(target, self, damage);
                }
            },
            2: {
                name: "Sanguine Offering",
                description: "Sacrifice 5% max health for 25% bonus attack damage",
                castChance: 0.3,
                cooldown: 4,
                currentCooldown: 0,
                damageType: 'physical',
                type: 'self',
                log(target, self, damage) {
                    addLine({
                        text: `${self.name} utilise Sanguine Offering et sacrifie ${damage} points de vie, augmentant ses dégats de 25%`,
                        styles: 
                            [   
                                { word: `Sanguine`, color: 'red'},
                                { word: `Offering`, color: 'red'},
                                { word: `${damage}`, color: 'red'},
                                { word: `25%`, color: 'green'}
                        ]
                    });
                },
                canUse(caster, target) {
                    const cost = Math.round(caster.statistics.maxHP * 0.05);

                    return (
                        this.currentCooldown === 0 && caster.statistics.HP > cost + 1
                    );
                },
                use(target, self) {
                    let damage = Math.round(self.statistics.maxHP * 0.05);

                    self.statistics.STR += Math.round(self.statistics.STR * 0.25);

                    self.statistics.HP -= damage;

                    this.currentCooldown = this.cooldown;

                    this.log(target, self, damage);
                }
            },
            3: {
                name: "Exsanguinate",
                description: "10% missing health healing, apply 10 dmg per turn bleeding on the caster, stackable. 10 turn duration",
                castChance: 0.3,
                cooldown: 6,
                currentCooldown: 0,
                damageType: 'physical',
                type: 'self',
                log(target, self, healing) {
                    addLine({
                        text: `${self.name} utilise Exsanguinate et se soigne de ${healing} points de vie!, ${self.name} saigne!`,
                        styles: 
                            [   
                                { word: `Exsanguinate`, color: 'red'},
                                { word: `soigne`, color: 'red'},
                                { word: `${healing}`, color: 'green'},
                                { word: `saigne!`, color: 'red'}
                        ]
                    });
                },
                canUse(caster, target) {
                    return (
                        this.currentCooldown === 0 && caster.statistics.hp >= caster.statistics.maxHP
                    );
                },
                use(target, self) {
                    let healing = Math.round((self.statistics.maxHP - self.statistics.HP) * 0.1);

                    self.statistics.HP += healing;

                    this.currentCooldown = this.cooldown;
                    
                    this.log(target, self, healing);
                }
            }
        },
    },
}