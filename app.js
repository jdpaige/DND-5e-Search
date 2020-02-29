// Data Controller
const DataCtrl = (function() {
    const spellsBtn = document.getElementById("getSpells");
    const classesBtn = document.getElementById("getClasses");
    const racesBtn = document.getElementById("getRaces");
    const monstersBtn = document.getElementById("getMonsters");
    const searchInput = document.getElementById("search-input");

    async function fetchInfo(info) {
        const res = await fetch(`http://www.dnd5eapi.co${info}`);
        const data = await res.text();
        return data;
    }

    return {
        spellsBtn: spellsBtn,
        classesBtn: classesBtn,
        racesBtn: racesBtn,
        monstersBtn: monstersBtn,
        fetchInfo: fetchInfo,
        searchInput: searchInput
    };
})();

// UI Controller
const UICtrl = (function() {
    const outputEl = document.getElementById("outputList");
    const moreInfoEl = document.getElementById("moreInfo");

    return {
        showData: function(data) {
            outputEl.innerHTML = "";
            moreInfoEl.innerHTML = "";
            data.forEach(item => {
                outputEl.innerHTML += `
                    <li class="list-group-item list-group-item-action shadow-sm">${item.name}</li>
                `;
            });
        },

        showRaceData: function(race) {
            moreInfoEl.innerHTML = "";
            moreInfoEl.innerHTML = `
                <div><strong>Race:</strong> ${race.name}</div>
                <div><strong>Ability Bonus:</strong> ${
                    race.ability_bonuses.length > 0
                        ? race.ability_bonuses.map(
                              bonus => `
                            <span>+${bonus.bonus} to <a href="#" class="tip" url="${bonus.url}" onmouseover="app.getToolTips(this, '${bonus.url}')">${bonus.name}</a></span>
                        `
                          )
                        : "none"
                }
                <div><strong>Speed:</strong> ${race.speed}</div>
                <div><strong>Alignment:</strong> ${race.alignment}</div>
                <div><strong>Size:</strong> ${race.size_description}</div>
                <div><strong>Starting Proficiencies:</strong> ${
                    race.starting_proficiencies.length > 0
                        ? race.starting_proficiencies.map(
                              prof => `
                                <span>${prof.name}</span>
                        `
                          )
                        : "none"
                }</div>
                <div><strong>Languages:</strong> ${race.language_desc}</div>
                <div><strong>Traits:</strong> ${
                    race.traits.length > 0
                        ? race.traits.map(
                              trait => `
                        <span><a href="" class="tip" url="${trait.url}" onmouseover="app.getToolTips(this, '${trait.url}')">${trait.name}</a></span>
                    `
                          )
                        : "none"
                }</div>
                <div><strong>Subraces:</strong> ${
                    race.subraces.length > 0
                        ? race.subraces.map(
                              subrace => `
                            <span>${subrace.name}</span>
                        `
                          )
                        : "none"
                }</div>
            `;
        },

        showClassData: function(cls) {
            moreInfoEl.innerHTML = "";
            moreInfoEl.innerHTML = `
                <div><strong>Class:</strong> ${cls.name}<div>
                <div><strong>Hit Die:</strong> d${cls.hit_die}</div>
                <div><strong>Proficiencies:</strong> ${cls.proficiencies.map(
                    prof => `
                    <span>${prof.name}</span>
                `
                )}</div>
                <div><strong>Additional Proficiencies:</strong> Choose ${
                    cls.proficiency_choices[0].choose
                } - ${cls.proficiency_choices[0].from.map(
                prof => `
                    <span>${prof.name}</span>
                `
            )}</div>
                <div><strong>Saving Throws:</strong> ${cls.saving_throws.map(
                    save => `
                    <a href="" onmouseover="app.getToolTips(this, '${save.url}')">${save.name}</a>
                `
                )}</div>
                
                
                
            `;
        },

        showSpellData: function(spell) {
            moreInfoEl.innerHTML = "";
            moreInfoEl.innerHTML = `
                <div><strong>Name:</strong> ${spell.name}</div>
                <div><strong>Level:</strong> ${spell.level}</div>
                <div><strong>Classes:</strong> ${spell.classes.map(
                    cla => `
                    <span>${cla.name}</span>
                `
                )}</div>
                <div><strong>Range:</strong> ${spell.range}</div>
                <div><strong>Casting Time:</strong> ${spell.casting_time}</div>
                <div><strong>Duration:</strong> ${spell.duration}</div>
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
const app = (function(dataCtrl, ui) {
    let currentCategory;
    let parsedData;

    // fetch info from api and display in list
    async function getInfo(e) {
        currentCategory = e.target.value;
        const info = await dataCtrl.fetchInfo(`/api/${currentCategory}`);
        parsedData = await JSON.parse(info).results;
        console.log(parsedData);
        ui.showData(parsedData);
    }

    // filter the displayed list
    function filterList(e) {
        const searchVal = e.target.value.toLowerCase();
        let filteredArr = parsedData.filter(listItem =>
            listItem.name.toLowerCase().includes(searchVal)
        );
        ui.showData(filteredArr);
    }

    // get url and fetch data
    async function logData(e) {
        const clickedItem = parsedData.filter(
            item => item.name === e.target.innerText
        )[0];

        const url = clickedItem.url;
        const clickedInfo = await dataCtrl.fetchInfo(url);

        return clickedInfo;
    }

    // show more data
    async function showMoreData(e) {
        const info = await logData(e);
        if (currentCategory === "races") {
            ui.showRaceData(JSON.parse(info));
        } else if (currentCategory === "classes") {
            ui.showClassData(JSON.parse(info));
        } else if (currentCategory === "spells") {
            ui.showSpellData(JSON.parse(info));
        } else if (currentCategory === "monsters") {
            ui.showMonsterData(JSON.parse(info));
        }
    }

    // event listeners
    dataCtrl.racesBtn.addEventListener("click", getInfo);
    dataCtrl.classesBtn.addEventListener("click", getInfo);
    dataCtrl.spellsBtn.addEventListener("click", getInfo);
    dataCtrl.monstersBtn.addEventListener("click", getInfo);
    dataCtrl.searchInput.addEventListener("input", filterList);
    ui.outputEl.addEventListener("click", showMoreData);

    async function getToolTips(el, url) {
        const tip = await dataCtrl.fetchInfo(url);
        const tipJSON = JSON.parse(tip);
        let tipDesc = "";
        await tipJSON.desc.forEach(desc => (tipDesc += desc));
        console.log(tipDesc);
        el.setAttribute("data-toggle", "tooltip");
        el.setAttribute("data-placement", "top");
        el.setAttribute("data-original-title", tipDesc);
        $(function() {
            $(el).tooltip("show");
        });
    }

    return {
        getToolTips: getToolTips
    };
})(DataCtrl, UICtrl);
