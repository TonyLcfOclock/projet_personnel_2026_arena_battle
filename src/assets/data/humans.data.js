const characters = {
    verso: {
        name: "Verso",
        image: "./src/assets/art/characters/humans/classes/death_knight/death_knight1.png",
        statistics: {
            HP: 800,
            maxHP: 800,
            STR: 150,
            ARM: 60,
            speed: 50,
            CritChance: 0.2,
            CritDamage: 1.5
        },
        selfAttributes: {
            Souls: 0,
        },
        /*passives: {
            perTurn(target, self) { // fonction exécutée au début du tour du personnage, gère les passifs du personnage
                self.statistics.STR = Math.floor(self.statistics.STR + (0.5 * self.selfAttributes.Souls));
                self.statistics.ARM = Math.floor(self.statistics.ARM + (0.5 * self.selfAttributes.Souls));
                self.statistics.speed = Math.floor(self.statistics.speed + (0.1 * self.selfAttributes.Souls));
                self.statistics.CritChance = self.statistics.CritChance + (0.01 * self.selfAttributes.Souls);
                self.statistics.CritDamage = self.statistics.CritDamage + (0.01 * self.selfAttributes.Souls);
            },
            onHit(target, self) { // fonction exécutée dès que le personnage prends un coups, gère les réactions à ce dernier
                if (self.buffs[1].isActive && !self.negativeEffects.stun.state) {

                    let damage = Math.round(fights.calculateDamage(self.statistics.STR, target.statistics.ARM)/2);
                    target.statistics.HP -= damage;

                    fight.addLine({
                        text: `${self.name} contre attaque et inflige ${damage} points de dégâts`,
                        styles: 
                            [   
                                { word: `contre`, color: 'grey'},
                                { word: `attaque`, color: 'grey'},
                                { word: `${damage}`, color: 'yellow'},
                        ]
                    });
                }
            }
        },*/
        buffs: {
            0: {
                name: "Overpower",
                state: false,
                isActive: false,
                isPermanent: false,
                duration: 0,
                applyBuff(target, self) {
                    if (this.isPermanent) {
                        return;
                    }

                    if (this.state) {
                        this.duration = 5;
                        self.statistics.speed += Math.round(self.statistics.speed * 0.3);
                    }
                },
                checkBuff(target, self) {
                    if (this.state && !this.isActive) {
                        this.isActive = true;
                        this.applyBuff(target, self);
                        return
                    }

                    if (this.duration > 0) {
                        this.duration --;
                    }

                    if (this.duration === 0 && this.isActive) {
                        this.state = false;
                        this.isActive = false;

                        self.statistics.speed = Math.round(self.statistics.speed / 1.3);
                        return
                    }
                }
            },
            1: {
                name: "Phantom Backlash",
                state: false,
                isActive: false,
                isPermanent: false,
                duration: 0,
                applyBuff(target, self) {
                    if (this.isPermanent) {
                        return;
                    }

                    if (this.state) {
                        this.duration = 2;
                    }
                },
                checkBuff(target, self) {
                    if (this.state && !this.isActive) {
                        this.isActive = true;
                        this.applyBuff(target, self);
                        return
                    }

                    if (this.duration > 0) {
                        this.duration --;
                    }

                    if (this.duration === 0 && this.isActive) {
                        this.state = false;
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
                    fight.addLine({
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
                    fight.addLine({
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
                    fight.addLine({
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
                    fight.addLine({
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
                    fight.addLine({
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
                    fight.addLine({
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
        spells: [
            {
                name: "Piercing Strike",
                image: "./src/assets/art/characters/humans/classes/death_knight/spells_icons/piercing_strike.png",
                description: "Piercing Strike on the enemy head, dealing 100 dmg",
                castChance: 0.15,
                cooldown: 0,
                currentCooldown: 0,
                damageType: 'physical',
                type: 'enemy',
            },
            {
                name: "Spectral Strike",
                image: "./src/assets/art/characters/humans/classes/death_knight/spells_icons/spectral_strike.png",
                description: "Dealing some DMG + 25% missing health of the target",
                castChance: 0.15,
                cooldown: 5,
                currentCooldown: 0,
                damageType: 'physical',
                type: 'enemy',
            },
            /*
            2: {
                name: "Overpower",
                image: "./src/assets/art/characters/humans/classes/death_knight/spells_icons/overpower.png",
                description: "+30% bonus speed and +30% bonus attack damage",
                castChance: 0.4,
                cooldown: 4,
                currentCooldown: 0,
                damageType: 'none',
                type: 'self',
                log(target, self) {
                    fight.addLine({
                        text: `${self.name} utilise Overpower et s'octroie un bonus de vitesse et de dégats supplémentaire de 30%`,
                        styles: 
                            [   
                                { word: `Overpower`, color: 'grey'},
                                { word: `vitesse`, color: 'grey'},
                                { word: `dégats`, color: 'grey'},
                                { word: `30%`, color: 'green'}
                        ]
                    });
                },
                canUse(caster, target) {
                    return this.currentCooldown === 0 && caster.buffs[0].isActive === false;
                },
                use(target, self) {
                    let damage = 0;
                    this.currentCooldown = this.cooldown;
                    self.buffs[0].state = true;

                    this.log(target, self);
                }
            },
            3: {
                name: "Soul Harvest",
                image: "./src/assets/art/characters/humans/classes/death_knight/spells_icons/soul_harvest.png",
                description: "Steal soul's fragment of the target, dealing damage and healing himself for 10% of this amount",
                castChance: 0.3,
                cooldown: 3,
                currentCooldown: 0,
                damageType: 'magical',
                type: 'enemy',
                log(target, self, damage, healing) {
                    fight.addLine({
                        text: `${self.name} utilise Soul Harvest, inflige ${damage} points de dégats et se soigne de ${healing} points de vie`,
                        styles: 
                            [   
                                { word: `Soul`, color: 'grey'},
                                { word: `Harvest`, color: 'grey'},
                                { word: `${damage}`, color: 'orange'},
                                { word: `${healing}`, color: 'green'}
                        ]
                    });
                },
                canUse(caster, target) {
                    return this.currentCooldown === 0;
                },
                use(target, self) {
                    let damage = fights.calculateDamage(self.statistics.STR, target.statistics.ARM);
                    let healing = Math.floor(damage * 0.10);
                    if (self.statistics.HP >= self.statistics.maxHP) {
                        healing = 0;
                    }

                    self.selfAttributes.Souls += 5;
                    self.statistics.HP += healing
                    
                    target.statistics.HP -= damage;

                    this.currentCooldown = this.cooldown;

                    this.log(target, self, damage, healing);
                }
            },
            4: {
                name: "Phantom Backlash",
                image: "./src/assets/art/characters/humans/classes/death_knight/spells_icons/phantom_backlash.png",
                description: "Activate counterattack for 2 turns. Counterattack dealing -50% attack damage. Can't fail.",
                castChance: 0.3,
                cooldown: 4,
                currentCooldown: 0,
                damageType: 'physical',
                type: 'self',
                log(target, self, damage) {
                    fight.addLine({
                        text: `${self.name} utilise Phantom Backlash et se prépare à riposter pendant 2 tours`,
                        styles: 
                            [   
                                { word: `Phantom`, color: 'grey'},
                                { word: `Backlash`, color: 'grey'},
                                { word: `riposter`, color: 'orange'},
                                { word: `2`, color: 'green'}
                        ]
                    });
                },
                canUse(caster, target) {
                    return this.currentCooldown === 0 && caster.buffs[1].isActive === false;
                },
                use(target, self) {
                    let damage = 0;
                    this.currentCooldown = this.cooldown;
                    self.buffs[1].state = true;

                    this.log(target, self);
                }
            }*/
        ],
    },
    /*{
        name: "Tatch",
        statistics: {
            HP: 1300,
            STR: 150,
            ARM: 45,
            speed: 45,
            CritChance: 0.2,
            CritDamage: 1.5
        },
        buffs: {
            overpower: false,
            voidShroud: false,
            canCounter: 0,
        },
        negativeEffects: {
            bleed: {
                bleeding: false,
                bleedingStacks: 0,
                bleedingDuration: 0,
                bleedingDamage: 0,
                log() {
                    fight.addLine({
                                    text: `${player.name} saigne et subit ${this.bleedingDamage} points de dégats de saignement!`,
                                    styles: 
                                        [
                                            { word: `${this.bleedingDamage}`, color: 'red'},
                                            { word: `saignement`, color: 'red'}
                                        ]
                                });
                },
            },
            poison: {
                poisoning: false,
                poisoningStacks: 0,
                poisoningDuration: 0,
                poisoningDamage: 0,
                log() {
                    fight.addLine({
                                    text: `${player.name} est empoisonné et subit ${this.poisoningDamage} points de dégats d'empoisonnement!`,
                                    styles: 
                                        [
                                            { word: `${this.poisoningDamage}`, color: 'purple'},
                                            { word: `empoisonnement`, color: 'purple'}
                                        ]
                                });
                },
            },
            burn: {
                burning: false,
                burningStacks: 0,
                burningDuration: 0,
                burningDamage: 0,
                log () {
                    fight.addLine({
                                    text: `${player.name} brûle et subit ${this.burningDamage} points de dégats de brûlure!`,
                                    styles: 
                                        [
                                            { word: `${this.burningDamage}`, color: 'orange'},
                                            { word: `brûlure`, color: 'orange'}
                                        ]
                                });
                },
            },
            freeze: {
                freezing: false,
                freezingStacks: 0,
                freezingDuration: 0,
                freezingDamage: 0,
                log () {
                    fight.addLine({
                                    text: `${player.name} est gelé et subit ${this.freezingDamage} points de dégats de gel!`,
                                    styles: 
                                        [
                                            { word: `${this.freezingDamage}`, color: 'lightblue'},
                                            { word: `gel`, color: 'lightblue'}
                                        ]
                                });
                },
            },
            slow: {
                slowed: false,
                slowPercent: 0,
                slowDuration: 0
            },
            stun: {
                stuned: 0,
                stunDuration: 0,
                stunReductionDamagePercent: 0,
            },
        },
        spells: {
            1: {
                name: "Void Shroud",
                description: "Absorbs damage for 1 turn and stock them",
                castChance: 0.4,
                cooldown: 2,
                currentCooldown: 0,
            },
            2: {
                name: "Void's Judgement",
                description: "Release the total of damage absorbed by Void Shroud",
                castChance: 0.3,
                cooldown: 4,
                currentCooldown: 0,
                totalDamage: 0,
            },
            3: {
                name: "Umbral Slash",
                description: "Perform a shadow slash, +25% damage each times launched",
                castChance: 0.6,
                cooldown: 2,
                currentCooldown: 0,
                totalStack: 0
            }
        },
        // class: "hunter",
        // skin: "hunter"
    },*/
    tatch: {
        name: "Tatch",
        image: "./src/char1.png",
        statistics: {
            HP: 800,
            maxHP: 800,
            STR: 150,
            ARM: 60,
            speed: 50,
            CritChance: 0.2,
            CritDamage: 1.5
        },
        selfAttributes: {
            Souls: 0
        },
        passives: {
            perTurn(target, self) { // fonction exécutée au début du tour du personnage, gère les passifs du personnage
                self.statistics.STR = Math.floor(150 + (1 * self.selfAttributes.Souls));
                self.statistics.ARM = Math.floor(60 + (1 * self.selfAttributes.Souls));
                self.statistics.speed = Math.floor(50 + (0.1 * self.selfAttributes.Souls));
                self.statistics.CritChance = 0.2 + (0.01 * self.selfAttributes.Souls);
                self.statistics.CritDamage = 1.5 + (0.01 * self.selfAttributes.Souls);
            },
            onHit(target, self) { // fonction exécutée dès que le personnage prends un coups, gère les réactions à ce dernier
            }
        },
        buffs: {
            1: {
                name: "Sanguine Offering",
                state: false,
                isActive: false,
                isPermanent: true,
                duration: 0,
                applyBuff() {
                    if (this.isPermanent) {
                        return;
                    }

                    this.state = true;

                    if (this.state) {
                        
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
                    fight.addLine({
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
                    fight.addLine({
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
                    fight.addLine({
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
                    this.log()
                }
            },
            freeze: {
                state: false,
                stacks: 0,
                duration: 0,
                damage: 0,
                log(self) {
                    fight.addLine({
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
                name: "Piercing Strike",
                image: "./src/piercing_strike.png",
                description: "Piercing Strike on the enemy head, dealing 100 dmg",
                castChance: 0.15,
                cooldown: 2,
                currentCooldown: 0,
                damageType: 'physical',
                type: 'enemy',
                log(target, self, damage) {
                    fight.addLine({
                        text: `${self.name} utilise ${this.name} et inflige ${damage} points de dégats à ${target.name}`,
                        styles: 
                            [   
                                { word: `Piercing`, color: 'grey'},
                                { word: `Strike`, color: 'grey'},
                                { word: `${damage}`, color: 'yellow'}
                        ]
                    });
                },
                canUse(caster, target) {
                    return this.currentCooldown === 0;
                },
                use(target, self) {
                    self.selfAttributes.Souls++;
                    let damage = Math.round(fights.calculateDamage(self.statistics.STR, target.statistics.ARM) * 1.2);
                    target.statistics.HP -= damage;

                    this.currentCooldown = this.cooldown;

                    this.log(target, self, damage);
                }
            },
            1: {
                name: "Spectral Strike",
                image: "./src/spectral_strike.png",
                description: "Dealing some DMG + 25% missing health of the target",
                castChance: 0.15,
                cooldown: 5,
                currentCooldown: 0,
                damageType: 'physical',
                type: 'enemy',
                log(target, self, damage) {
                    fight.addLine({
                        text: `${self.name} utilise ${this.name} et inflige ${damage} points de dégats à ${target.name}`,
                        styles: 
                            [   
                                { word: `Spectral`, color: 'grey'},
                                { word: `Strike`, color: 'grey'},
                                { word: `${damage}`, color: 'grey'}
                        ]
                    });
                },
                canUse(caster, target) {
                    return this.currentCooldown === 0;
                },
                use(target, self) {
                    let targetHP = target.statistics.maxHP - target.statistics.HP;
                    let percentMissingHealthDamage = Math.round(targetHP * 0.25);

                    let damage = Math.round(fights.calculateDamage(self.statistics.STR, target.statistics.ARM) / 2 + percentMissingHealthDamage);
                    target.statistics.HP -= damage;

                    this.currentCooldown = this.cooldown;

                    this.log(target, self, damage);
                }
            },
            2: {
                name: "Overpower",
                image: "./src/overpower.png",
                description: "+30% bonus speed and +30% bonus attack damage",
                castChance: 0.4,
                cooldown: 5,
                currentCooldown: 0,
                damageType: 'none',
                type: 'self',
                log(target, self) {
                    fight.addLine({
                        text: `${self.name} utilise Overpower et s'octroie un bonus de vitesse et de dégats supplémentaire de 30%`,
                        styles: 
                            [   
                                { word: `Overpower`, color: 'grey'},
                                { word: `vitesse`, color: 'grey'},
                                { word: `dégats`, color: 'grey'},
                                { word: `30%`, color: 'green'}
                        ]
                    });
                },
                canUse(caster, target) {
                    return this.currentCooldown === 0;
                },
                use(target, self) {
                    let damage = 0;
                    this.currentCooldown = this.cooldown;

                    this.log(target, self);
                }
            },
            3: {
                name: "Soul Harvest",
                image: "./src/soul_harvest.png",
                description: "Steal soul's fragment of the target, dealing damage and healing himself for 10% of this amount",
                castChance: 0.3,
                cooldown: 3,
                currentCooldown: 0,
                damageType: 'magical',
                type: 'enemy',
                log(target, self, damage, healing) {
                    fight.addLine({
                        text: `${self.name} utilise Soul Harvest, inflige ${damage} points de dégats et se soigne de ${healing} points de vie`,
                        styles: 
                            [   
                                { word: `Soul`, color: 'grey'},
                                { word: `Harvest`, color: 'grey'},
                                { word: `${damage}`, color: 'orange'},
                                { word: `${healing}`, color: 'green'}
                        ]
                    });
                },
                canUse(caster, target) {
                    return this.currentCooldown === 0;
                },
                use(target, self) {
                    let damage = fights.calculateDamage(self.statistics.STR, target.statistics.ARM);
                    let healing = Math.floor(damage * 0.10);
                    if (self.statistics.HP >= self.statistics.maxHP) {
                        healing = 0;
                    }

                    self.selfAttributes.Souls += 5;
                    self.statistics.HP += healing
                    
                    target.statistics.HP -= damage;

                    this.currentCooldown = this.cooldown;

                    this.log(target, self, damage, healing);
                }
            },
            4: {
                name: "Phantom Backlash",
                image: "./src/phantom_backlash.png",
                description: "Activate counterattack for 2 turns. Counterattack dealing -50% attack damage. Can't fail.",
                castChance: 0.3,
                cooldown: 4,
                currentCooldown: 0,
                damageType: 'physical',
                type: 'self',
                log(target, self, damage) {
                    fight.addLine({
                        text: `${self.name} utilise Phantom Backlash et se prépare à riposter pendant 2 tours`,
                        styles: 
                            [   
                                { word: `Phantom`, color: 'grey'},
                                { word: `Backlash`, color: 'grey'},
                                { word: `riposter`, color: 'orange'},
                                { word: `2`, color: 'green'}
                        ]
                    });
                },
                canUse(caster, target) {
                    return this.currentCooldown === 0;
                },
                use(target, self) {
                    let damage = 0;
                    
                    target.selfAttributes.Souls++;

                    this.currentCooldown = this.cooldown;

                    this.log(target, self, damage);
                }
            }
        },
        // class: "hunter",
        // skin: "hunter"
    },
}

export default characters;