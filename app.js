// Data Controller
const DataCtrl = (function() {
    const spellsBtn = document.getElementById("getSpells");
    const classesBtn = document.getElementById("getClasses");
    const racesBtn = document.getElementById("getRaces");
    const monstersBtn = document.getElementById("getMonsters");

    async function getInfo(info) {
        const res = await fetch(`http://www.dnd5eapi.co${info}`);
        const data = await res.text();
        // const dataJSON = await JSON.parse(data).results;
        // return dataJSON;
        return data;
    }

    return {
        spellsBtn: spellsBtn,
        classesBtn: classesBtn,
        racesBtn: racesBtn,
        monstersBtn: monstersBtn,
        getInfo: getInfo
    };
})();

// UI Controller
const UICtrl = (function() {
    const outputEl = document.getElementById("outputList");
    const moreInfoEl = document.getElementById("moreInfo");

    function stringifyList(list) {
        let output = "";
        list.forEach(item => {
            if (list.length === 1) {
                output += item.name;
            } else if (list.indexOf(item) !== list.length - 1) {
                output += item.name + ", ";
            } else {
                output += item.name;
            }
        });
        return output;
    }

    return {
        showData: function(data) {
            outputEl.innerHTML = "";
            moreInfoEl.innerHTML = "";
            data.forEach(item => {
                outputEl.innerHTML += `
                    <li class="list-group-item shadow-sm">${item.name}</li>
                `;
            });
        },

        showRaceData: function(race) {
            moreInfoEl.innerHTML = "";
            moreInfoEl.innerHTML = `
                <div><strong>Race:</strong> ${race.name}</div>
                <div><strong>Ability Bonus:</strong> ${
                    race.ability_bonuses.length > 0
                        ? stringifyBonuses(race.ability_bonuses)
                        : "none"
                }
                <div><strong>Speed:</strong> ${race.speed}</div>
                <div><strong>Alignment:</strong> ${race.alignment}</div>
                <div><strong>Size:</strong> ${race.size_description}</div>
                <div><strong>Starting Proficiencies:</strong> ${
                    race.starting_proficiencies.length > 0
                        ? stringifyList(race.starting_proficiencies)
                        : "none"
                }</div>
                <div><strong>Languages:</strong> ${race.language_desc}</div>
                <div><strong>Traits:</strong> ${
                    race.traits.length > 0 ? stringifyList(race.traits) : "none"
                }</div>
                <div><strong>Subraces:</strong> ${
                    race.subraces.length > 0
                        ? stringifyList(race.subraces)
                        : "none"
                }</div>
            `;

            function stringifyBonuses(list) {
                let output = "";
                list.forEach(bonus => {
                    if (list.length === 1) {
                        output += `+${bonus.bonus} to ${bonus.name}`;
                    } else if (list.indexOf(bonus) !== list.length - 1) {
                        output += `+${bonus.bonus} to ${bonus.name}, `;
                    } else {
                        output += `+${bonus.bonus} to ${bonus.name}`;
                    }
                });
                return output;
            }
        },

        showClassData: function(cls) {
            moreInfoEl.innerHTML = "";
            moreInfoEl.innerHTML = `
                <div><strong>Class:</strong> ${cls.name}<div>
                <div><strong>Hit Die:</strong> d${cls.hit_die}</div>
                <div><strong>Proficiencies:</strong> Choose ${
                    cls.proficiency_choices[0].choose
                }: ${stringifyList(cls.proficiencies)}</div>
                <div><strong>Saving Throws:</strong> ${stringifyList(
                    cls.saving_throws
                )}</div>
                
            `;
        },

        showSpellData: function(spell) {
            moreInfoEl.innerHTML = "";
            moreInfoEl.innerHTML = `
                <div><strong>Name:</strong> ${spell.name}</div>
                <div><strong>Level:</strong> ${spell.level}</div>
                <div><strong>Classes:</strong> ${stringifyList(
                    spell.classes
                )}</div>
                <div><strong>Range:</strong> ${spell.range}</div>
                <div><strong>Casting Time:</strong ${spell.casting_time}</div>
                <div><strong>Components:</strong> ${String(
                    spell.components
                )}</div>
                <div><strong>Material:</strong> ${
                    spell.material ? spell.material : "none"
                }
                <div><strong>Description:</strong> ${spell.desc}</div>
                <div><strong>At Higher Levels:</strong> ${
                    spell.higher_level ? spell.higher_level[0] : "n/a"
                }
            `;
        },

        showMonsterData: function(monster) {
            moreInfoEl.innerHTML = "";
            moreInfoEl.innerHTML = `
                <div class="row">
                    <div class="col-6">
                        <div><strong>Name:</strong> ${monster.name}</div>
                        <div><strong>Size:</strong> ${monster.size}</div>
                        <div><strong>Type:</strong> ${monster.type}</div>
                        <div><strong>Alignment:</strong> ${monster.alignment}</div>
                        <div><strong>AC:</strong> ${monster.armor_class}</div>
                        <div><strong>Hit Points:</strong> ${monster.hit_points} (${monster.hit_dice})</div>
                        <div><strong>CR:</strong> ${monster.challenge_rating}</div>
                        <div><strong>Languages:</strong> ${monster.languages}</div>
                    </div>
                    <div class="col-6">
                        <div><strong>Stats:</strong>
                            <div class="row">
                                <ul class="list-group col-6">
                                    <li class="list-group-item">STR: ${monster.strength}</li>
                                    <li class="list-group-item">DEX: ${monster.dexterity}</li>
                                    <li class="list-group-item">CON: ${monster.constitution}</li>
                                    
                                </ul>
                                <ul class="list-group col-6">
                                    <li class="list-group-item">INT: ${monster.intelligence}</li>
                                    <li class="list-group-item">WIS: ${monster.wisdom}</li>
                                    <li class="list-group-item">CHA: ${monster.charisma}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
            `;
        },

        outputEl: outputEl,
        moreInfoEl: moreInfoEl
    };
})();

// Main Controller
const app = (function(data, ui) {
    let outputArr = [];
    let category;

    // fetch races list from api
    async function getRaces() {
        const racesData = await data.getInfo("/api/races");
        const races = await JSON.parse(racesData).results;
        console.log(races);
        outputArr = [];
        races.forEach(race => outputArr.push(race));
    }

    // show races
    async function showRaces() {
        category = "races";
        await getRaces();
        ui.showData(outputArr);
    }

    // fetch classes list from api
    async function getClasses() {
        const classesData = await data.getInfo("/api/classes");
        const classes = await JSON.parse(classesData).results;
        // console.log(classes);
        outputArr = [];
        classes.forEach(cls => outputArr.push(cls));
    }

    // show classes
    async function showClasses() {
        category = "classes";
        await getClasses();
        ui.showData(outputArr);
    }

    // fetch spells list from api
    async function getSpells() {
        const spellsData = await data.getInfo("/api/spells");
        const spells = await JSON.parse(spellsData).results;
        // console.log(spells);
        outputArr = [];
        spells.forEach(spell => outputArr.push(spell));
    }

    // show spells
    async function showSpells() {
        category = "spells";
        await getSpells();
        ui.showData(outputArr);
    }

    // fetch monsters list from api
    async function getMonsters() {
        const monstersData = await data.getInfo("/api/monsters");
        const monsters = await JSON.parse(monstersData).results;
        // console.log(monsters);
        outputArr = [];
        monsters.forEach(monster => outputArr.push(monster));
    }

    // show monsters
    async function showMonsters() {
        category = "monsters";
        await getMonsters();
        ui.showData(outputArr);
    }

    // get url and fetch data
    async function logData(e) {
        const clickedItem = outputArr.filter(
            item => item.name === e.target.innerText
        )[0];

        const url = clickedItem.url;
        const clickedInfo = await data.getInfo(url);

        console.log(JSON.parse(clickedInfo));
        return clickedInfo;
    }

    // show more data
    async function showMoreData(e) {
        const info = await logData(e);
        if (category === "races") {
            ui.showRaceData(JSON.parse(info));
        } else if (category === "classes") {
            ui.showClassData(JSON.parse(info));
        } else if (category === "spells") {
            ui.showSpellData(JSON.parse(info));
        } else if (category === "monsters") {
            ui.showMonsterData(JSON.parse(info));
        }
    }

    // event listeners
    data.racesBtn.addEventListener("click", showRaces);
    data.classesBtn.addEventListener("click", showClasses);
    data.spellsBtn.addEventListener("click", showSpells);
    data.monstersBtn.addEventListener("click", showMonsters);
    ui.outputEl.addEventListener("click", showMoreData);
})(DataCtrl, UICtrl);